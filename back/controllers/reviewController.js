const { Review, User, EquipmentSeller, Order, Product } = require('../models/models');

class ReviewController {
    async createReview(req, res) {
        try {
            // Извлекаем все необходимые поля, включая productId
            const {
                rating,
                shortReview,
                reviewText,
                orderId,
                productId, // новое поле
                easeOfInstallation,
                buildQuality,
                technicalSupport,
                valueForMoney
            } = req.body;
            const userId = req.user.userId;

            if (!userId) {
                return res.status(401).json({ message: 'Неавторизованный пользователь' });
            }

            const order = await Order.findByPk(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Заказ не найден' });
            }

            // Отзыв можно оставить только для выполненных заказов (status: delivered)
            if (order.status !== 'delivered') {
                return res.status(400).json({ message: 'Отзыв можно оставить только для выполненных заказов' });
            }

            const existingReview = await Review.findOne({ where: { orderId } });
            if (existingReview) {
                return res.status(400).json({ message: 'Отзыв для данного заказа уже существует' });
            }

            // Используем equipmentSellerId из заказа
            const equipmentSellerId = order.equipmentSellerId;

            // Передаём productId при создании отзыва
            const review = await Review.create({
                rating,
                shortReview,
                reviewText,
                orderId,
                productId,
                equipmentSellerId,
                userId,
                easeOfInstallation,
                buildQuality,
                technicalSupport,
                valueForMoney,
            });

            res.status(201).json(review);
        } catch (error) {
            console.error('Ошибка при создании отзыва:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getReviewById(req, res) {
        try {
            const { id } = req.params;

            const review = await Review.findByPk(id, {
                include: [
                    { model: Order },
                    { model: EquipmentSeller },
                    { model: User, attributes: ['firstName', 'lastName'] },
                ],
            });

            if (!review) {
                return res.status(404).json({ message: 'Отзыв не найден' });
            }

            res.json(review);
        } catch (error) {
            console.error('Ошибка при получении отзыва:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getAllReviews(req, res) {
        try {
            const reviews = await Review.findAll({
                include: [
                    { model: Order },
                    { model: EquipmentSeller },
                    { model: User, attributes: ['firstName', 'lastName'] },
                ],
                order: [['createdAt', 'DESC']],
            });

            res.json(reviews);
        } catch (error) {
            console.error('Ошибка при получении отзывов:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async updateReview(req, res) {
        try {
            const { id } = req.params;
            // Обновление отзыва клиентом
            const {
                rating,
                shortReview,
                reviewText,
                easeOfInstallation,
                buildQuality,
                technicalSupport,
                valueForMoney
            } = req.body;
            const userId = req.user.userId;

            const review = await Review.findByPk(id);
            if (!review) {
                return res.status(404).json({ message: 'Отзыв не найден' });
            }

            if (review.userId !== userId) {
                return res.status(403).json({ message: 'Нет доступа для редактирования этого отзыва' });
            }

            await review.update({
                rating,
                shortReview,
                reviewText,
                easeOfInstallation,
                buildQuality,
                technicalSupport,
                valueForMoney,
            });

            res.json(review);
        } catch (error) {
            console.error('Ошибка при обновлении отзыва:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async deleteReview(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;

            const review = await Review.findByPk(id);
            if (!review) {
                return res.status(404).json({ message: 'Отзыв не найден' });
            }

            if (review.userId !== userId) {
                return res.status(403).json({ message: 'Нет доступа для удаления этого отзыва' });
            }

            await review.destroy();

            res.status(200).json({ message: 'Отзыв успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении отзыва:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getReviewsByEquipmentSeller(req, res) {
        try {
            const sellerId = parseInt(req.params.sellerId, 10);
            const reviews = await Review.findAll({
                where: { equipmentSellerId: sellerId },
                include: [
                    { model: Order },
                    { model: EquipmentSeller },
                    { model: User, attributes: ['firstName', 'lastName'] },
                    { model: Product, attributes: ['id', 'name'] } // Теперь ассоциация установлена
                ],
                order: [['createdAt', 'DESC']],
            });
            res.json(reviews);
        } catch (error) {
            console.error('Ошибка при получении отзывов продавца:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async updateReviewResponse(req, res) {
        try {
            const { id } = req.params;
            const { sellerResponse } = req.body;

            const review = await Review.findByPk(id);
            if (!review) {
                return res.status(404).json({ message: 'Отзыв не найден' });
            }

            // Проверяем, что продавец авторизован и имеет право редактировать ответ
            if (req.user.equipmentSellerId !== review.equipmentSellerId) {
                return res.status(403).json({ message: 'Нет доступа для редактирования ответа' });
            }

            await review.update({ sellerResponse });
            res.json(review);
        } catch (error) {
            console.error('Ошибка при обновлении ответа продавца:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new ReviewController();
