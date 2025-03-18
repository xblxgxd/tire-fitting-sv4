const {
    Order,
    OrderItem,
    Cart,
    CartItem,
    Product,
    User,
    EquipmentSeller,
    Review
} = require('../models/models');

class OrderController {

    async createOrder(req, res) {
        try {
            const {
                deliveryAddress,
                paymentMethod,
                discountPoints,
                installationRequested, // новое поле
                deliveryMethod: orderDeliveryMethod, // новое поле (переименовано для избежания конфликта имен)
                estimatedDeliveryDate // новое поле
            } = req.body;
            const userId = req.user.userId;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            // Используем модель Cart вместо Basket
            const cart = await Cart.findOne({
                where: { userId },
                include: [
                    {
                        model: CartItem,
                        include: [Product],
                    },
                ],
            });

            if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
                return res.status(400).json({ message: 'Ваша корзина пуста' });
            }

            // Рассчитываем общую стоимость заказа
            let totalCost = cart.CartItems.reduce((acc, item) => {
                return acc + parseFloat(item.Product.price) * item.quantity;
            }, 0);

            // Извлекаем идентификаторы продавцов из товаров корзины
            const equipmentSellerIds = [...new Set(cart.CartItems.map((item) => item.Product.equipmentSellerId))];
            if (equipmentSellerIds.length > 1) {
                return res.status(400).json({ message: 'Все товары должны принадлежать одному продавцу' });
            }

            // Применяем скидку, если переданы discountPoints
            let appliedDiscount = 0;
            if (discountPoints && discountPoints > 0) {
                if (user.points < discountPoints) {
                    return res.status(400).json({ message: 'Недостаточно баллов для применения скидки' });
                }
                appliedDiscount = discountPoints;
                totalCost = Math.max(totalCost - appliedDiscount, 0);

                user.points -= discountPoints;
                await user.save();
            }

            const trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

            // Создаем заказ с использованием новых полей
            const order = await Order.create({
                deliveryAddress,
                totalCost,
                status: 'pending',
                paymentMethod,
                trackingNumber,
                orderDate: new Date(),
                userId,
                equipmentSellerId: equipmentSellerIds[0],
                installationRequested: installationRequested || false,
                deliveryMethod: orderDeliveryMethod,
                estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : null,
            });

            // Формируем элементы заказа из товаров корзины
            const orderItems = cart.CartItems.map((item) => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: item.Product.price,
            }));

            await OrderItem.bulkCreate(orderItems);
            await CartItem.destroy({ where: { cartId: cart.id } });

            res.status(201).json({ message: 'Заказ успешно создан', order });
        } catch (error) {
            console.error('Ошибка при создании заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getUserOrders(req, res) {
        try {
            const userId = req.user.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Неавторизованный пользователь' });
            }

            const orders = await Order.findAll({
                where: { userId },
                include: [
                    {
                        model: OrderItem,
                        as: 'orderItems', // указали алиас, как определено в ассоциации
                        include: [Product],
                    },
                    {
                        model: Review,
                        include: [{ model: User, attributes: ['firstName', 'lastName'] }],
                    },
                ],
                order: [['orderDate', 'DESC']],
            });


            res.json(orders);
        } catch (error) {
            console.error('Ошибка при получении заказов пользователя:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getOrderById(req, res) {
        try {
            const { id } = req.params;

            const order = await Order.findByPk(id, {
                include: [
                    {
                        model: OrderItem,
                        as: 'orderItems', // указываем алиас, как задан в ассоциации
                        include: [Product],
                    },
                    {
                        model: Review,
                        include: [{ model: User, attributes: ['firstName', 'lastName'] }],
                    },
                ],
            });


            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            res.json(order);
        } catch (error) {
            console.error('Ошибка при получении заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            // Допустимые статусы согласно модели заказа
            const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({ message: 'Недопустимый статус заказа' });
            }

            // При переводе заказа в статус delivered начисляем бонусные баллы пользователю
            if (status === 'delivered' && order.status !== 'delivered') {
                const bonusPoints = Math.floor(order.totalCost / 100);
                const user = await User.findByPk(order.userId);
                if (user) {
                    user.points += bonusPoints;
                    await user.save();
                }
            }

            order.status = status;
            await order.save();

            res.json(order);
        } catch (error) {
            console.error('Ошибка при обновлении статуса заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Новый метод для обновления дополнительных деталей заказа
    async updateOrderDetails(req, res) {
        try {
            const { id } = req.params;
            const { installationRequested, deliveryMethod, estimatedDeliveryDate } = req.body;

            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            // Обновляем поля, если они переданы
            if (installationRequested !== undefined) {
                order.installationRequested = installationRequested;
            }
            if (deliveryMethod) {
                order.deliveryMethod = deliveryMethod;
            }
            if (estimatedDeliveryDate) {
                order.estimatedDeliveryDate = new Date(estimatedDeliveryDate);
            }

            await order.save();
            res.json({ message: 'Детали заказа обновлены', order });
        } catch (error) {
            console.error('Ошибка при обновлении деталей заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async deleteOrder(req, res) {
        try {
            const { id } = req.params;
            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            // Разрешаем удаление заказа пользователем или продавцом
            if (req.user.userId) {
                if (order.userId !== req.user.userId) {
                    return res.status(403).json({ message: 'Нет прав для удаления этого заказа' });
                }
            } else if (req.user.equipmentSellerId) {
                if (order.equipmentSellerId !== req.user.equipmentSellerId) {
                    return res.status(403).json({ message: 'Нет прав для удаления этого заказа' });
                }
            } else {
                return res.status(403).json({ message: 'Нет прав для удаления этого заказа' });
            }

            await OrderItem.destroy({ where: { orderId: id } });
            await order.destroy();
            res.status(200).json({ message: 'Заказ успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении заказа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getEquipmentSellerOrders(req, res) {
        try {
            const equipmentSellerId = req.user.equipmentSellerId;
            console.log('Получение заказов для продавца ID:', equipmentSellerId);
            if (!equipmentSellerId) {
                return res.status(401).json({ message: 'Неавторизованный пользователь' });
            }

            const seller = await EquipmentSeller.findByPk(equipmentSellerId);
            if (!seller) {
                return res.status(404).json({ message: 'Продавец не найден' });
            }

            const orders = await Order.findAll({
                where: { equipmentSellerId: seller.id },
                include: [
                    { model: User, attributes: ['firstName', 'lastName', 'phone'] },
                    { model: OrderItem, as: 'orderItems', include: [Product] }
                ],
                order: [['orderDate', 'DESC']],
            });


            res.json(orders);
        } catch (error) {
            console.error('Ошибка при получении заказов продавца:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new OrderController();
