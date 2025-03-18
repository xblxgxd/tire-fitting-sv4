const { Cart, CartItem, Product, User } = require('../models/models');

class CartController {
    async getBasket(req, res) {
        try {
            const userId = req.user.userId;
            console.log(`Получение корзины для пользователя ID: ${userId}`);

            let cart = await Cart.findOne({
                where: { userId },
                include: [
                    {
                        model: CartItem,
                        include: [Product],
                    },
                ],
            });

            if (!cart) {
                console.log('Корзина отсутствует. Создание новой корзины.');
                cart = await Cart.create({ userId });
            }

            console.log('Полученная корзина:', cart);
            res.json(cart);
        } catch (error) {
            console.error('Ошибка при получении корзины:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async addItem(req, res) {
        try {
            const userId = req.user.userId;
            const { productId, quantity } = req.body;

            // Проверяем, что количество положительное
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Количество должно быть больше нуля.' });
            }

            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Товар не найден.' });
            }

            let cart = await Cart.findOne({
                where: { userId },
                include: [{
                    model: CartItem,
                    include: [Product],
                }],
            });

            if (!cart) {
                cart = await Cart.create({ userId });
            }

            // Проверка: товары в корзине должны быть от одного продавца
            if (cart.CartItems && cart.CartItems.length > 0) {
                const existingSellerId = cart.CartItems[0].Product.equipmentSellerId;
                if (existingSellerId !== product.equipmentSellerId) {
                    return res.status(400).json({ message: 'В корзине могут быть товары только от одного продавца.' });
                }
            }

            let cartItem = await CartItem.findOne({
                where: { cartId: cart.id, productId },
                include: [Product],
            });

            if (cartItem) {
                cartItem.quantity += quantity;
                await cartItem.save();
            } else {
                cartItem = await CartItem.create({
                    cartId: cart.id,
                    productId,
                    quantity,
                });
                // Получаем созданный элемент с данными товара
                cartItem = await CartItem.findByPk(cartItem.id, { include: [Product] });
            }

            res.status(201).json(cartItem);
        } catch (error) {
            console.error('Ошибка при добавлении товара в корзину:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async removeItem(req, res) {
        try {
            const userId = req.user.userId;
            const { productId } = req.params;

            const cart = await Cart.findOne({ where: { userId } });
            if (!cart) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }

            const cartItem = await CartItem.findOne({
                where: { cartId: cart.id, productId },
            });

            if (!cartItem) {
                return res.status(404).json({ message: 'Товар в корзине не найден' });
            }

            await cartItem.destroy();
            res.status(200).json({ message: 'Товар успешно удален из корзины' });
        } catch (error) {
            console.error('Ошибка при удалении товара из корзины:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async updateItemQuantity(req, res) {
        try {
            const userId = req.user.userId;
            const { productId } = req.params;
            const { quantity } = req.body;

            // Проверяем, что новое количество положительное
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Количество должно быть больше нуля.' });
            }

            const cart = await Cart.findOne({ where: { userId } });
            if (!cart) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }

            const cartItem = await CartItem.findOne({
                where: { cartId: cart.id, productId },
            });

            if (!cartItem) {
                return res.status(404).json({ message: 'Товар в корзине не найден' });
            }

            cartItem.quantity = quantity;
            await cartItem.save();

            res.status(200).json(cartItem);
        } catch (error) {
            console.error('Ошибка при обновлении количества товара в корзине:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async clearCart(req, res) {
        try {
            const userId = req.user.userId;
            const cart = await Cart.findOne({ where: { userId } });
            if (!cart) {
                return res.status(404).json({ message: 'Корзина не найдена' });
            }

            await CartItem.destroy({ where: { cartId: cart.id } });
            res.status(200).json({ message: 'Корзина успешно очищена' });
        } catch (error) {
            console.error('Ошибка при очистке корзины:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new CartController();
