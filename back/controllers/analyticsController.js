const { Analytics, EquipmentSeller, Product } = require('../models/models');

class AnalyticsController {
    // Создание новой записи аналитики (только для авторизованного продавца)
    async createAnalytics(req, res) {
        try {
            const equipmentSellerId = req.user.equipmentSellerId;
            if (!equipmentSellerId) {
                return res.status(401).json({ message: 'Неавторизованный продавец' });
            }

            const { productId, totalSales, consultationRequestsCount, averageRating } = req.body;
            if (!productId) {
                return res.status(400).json({ message: 'ProductId обязателен' });
            }

            // Проверяем, что продукт существует и принадлежит продавцу
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Продукт не найден' });
            }
            if (product.equipmentSellerId !== equipmentSellerId) {
                return res.status(403).json({ message: 'Нет прав для создания аналитики для данного продукта' });
            }

            const analytics = await Analytics.create({
                equipmentSellerId,
                productId,
                totalSales: totalSales || 0,
                consultationRequestsCount: consultationRequestsCount || 0,
                averageRating: averageRating || null,
            });
            res.status(201).json(analytics);
        } catch (error) {
            console.error('Ошибка при создании аналитики:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Получение записи аналитики по ID
    async getAnalyticsById(req, res) {
        try {
            const { id } = req.params;
            const analytics = await Analytics.findByPk(id, {
                include: [
                    { model: EquipmentSeller, attributes: ['companyName'] },
                    { model: Product, attributes: ['name', 'brand'] },
                ],
            });
            if (!analytics) {
                return res.status(404).json({ message: 'Запись аналитики не найдена' });
            }
            res.json(analytics);
        } catch (error) {
            console.error('Ошибка при получении аналитики по ID:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Получение списка записей аналитики с фильтрацией по equipmentSellerId и productId
    async getAllAnalytics(req, res) {
        try {
            const { equipmentSellerId, productId } = req.query;
            const where = {};
            if (equipmentSellerId) where.equipmentSellerId = equipmentSellerId;
            if (productId) where.productId = productId;

            const analyticsRecords = await Analytics.findAll({
                where,
                include: [
                    { model: EquipmentSeller, attributes: ['companyName'] },
                    { model: Product, attributes: ['name', 'brand'] },
                ],
                order: [['createdAt', 'DESC']],
            });
            res.json(analyticsRecords);
        } catch (error) {
            console.error('Ошибка при получении аналитики:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Обновление записи аналитики (только для продавца, которому принадлежит запись)
    async updateAnalytics(req, res) {
        try {
            const equipmentSellerId = req.user.equipmentSellerId;
            if (!equipmentSellerId) {
                return res.status(401).json({ message: 'Неавторизованный продавец' });
            }
            const { id } = req.params;
            const { totalSales, consultationRequestsCount, averageRating } = req.body;

            const analytics = await Analytics.findByPk(id);
            if (!analytics) {
                return res.status(404).json({ message: 'Запись аналитики не найдена' });
            }
            if (analytics.equipmentSellerId !== equipmentSellerId) {
                return res.status(403).json({ message: 'Нет прав для обновления данной записи аналитики' });
            }

            const updatedData = {};
            if (totalSales !== undefined) updatedData.totalSales = totalSales;
            if (consultationRequestsCount !== undefined) updatedData.consultationRequestsCount = consultationRequestsCount;
            if (averageRating !== undefined) updatedData.averageRating = averageRating;

            await analytics.update(updatedData);
            res.json(analytics);
        } catch (error) {
            console.error('Ошибка при обновлении аналитики:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Удаление записи аналитики (только для продавца, которому принадлежит запись)
    async deleteAnalytics(req, res) {
        try {
            const equipmentSellerId = req.user.equipmentSellerId;
            if (!equipmentSellerId) {
                return res.status(401).json({ message: 'Неавторизованный продавец' });
            }
            const { id } = req.params;
            const analytics = await Analytics.findByPk(id);
            if (!analytics) {
                return res.status(404).json({ message: 'Запись аналитики не найдена' });
            }
            if (analytics.equipmentSellerId !== equipmentSellerId) {
                return res.status(403).json({ message: 'Нет прав для удаления данной записи аналитики' });
            }
            await analytics.destroy();
            res.status(200).json({ message: 'Запись аналитики успешно удалена' });
        } catch (error) {
            console.error('Ошибка при удалении аналитики:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new AnalyticsController();