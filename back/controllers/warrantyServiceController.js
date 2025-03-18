const { WarrantyService, OrderItem, Product } = require('../models/models');

class WarrantyServiceController {
    // Создание записи гарантии и сервиса
    async createWarrantyService(req, res) {
        try {
            const equipmentSellerId = req.user.equipmentSellerId;
            if (!equipmentSellerId) {
                return res.status(401).json({ message: 'Неавторизованный продавец' });
            }

            const { orderItemId, warrantyPeriod, serviceConditions, serviceCenterContacts, validUntil, isExtendedWarranty } = req.body;
            if (!orderItemId || !warrantyPeriod || !serviceConditions || !serviceCenterContacts || !validUntil) {
                return res.status(400).json({ message: 'Заполните все обязательные поля' });
            }

            // Проверяем, что заказной элемент существует и принадлежит продукту данного продавца
            const orderItem = await OrderItem.findByPk(orderItemId, {
                include: [{ model: Product }],
            });
            if (!orderItem) {
                return res.status(404).json({ message: 'Элемент заказа не найден' });
            }
            if (orderItem.Product.equipmentSellerId !== equipmentSellerId) {
                return res.status(403).json({ message: 'Нет прав для оформления гарантии по данному заказу' });
            }

            const warrantyService = await WarrantyService.create({
                orderItemId,
                warrantyPeriod,
                serviceConditions,
                serviceCenterContacts,
                validUntil,
                isExtendedWarranty: isExtendedWarranty === 'true' || isExtendedWarranty === true,
            });

            res.status(201).json(warrantyService);
        } catch (error) {
            console.error('Ошибка при создании записи гарантии и сервиса:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Получение записи гарантии и сервиса по ID
    async getWarrantyServiceById(req, res) {
        try {
            const { id } = req.params;
            const warrantyService = await WarrantyService.findByPk(id, {
                include: [{
                    model: OrderItem,
                    include: [{ model: Product }]
                }]
            });
            if (!warrantyService) {
                return res.status(404).json({ message: 'Запись гарантии и сервиса не найдена' });
            }
            res.json(warrantyService);
        } catch (error) {
            console.error('Ошибка при получении записи гарантии и сервиса:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Получение списка записей гарантии и сервиса с возможной фильтрацией
    async getAllWarrantyServices(req, res) {
        try {
            const { orderItemId, equipmentSellerId } = req.query;
            const where = {};
            if (orderItemId) where.orderItemId = orderItemId;
            // Фильтрация по equipmentSellerId через связанные продукты заказа
            if (equipmentSellerId) {
                // Находим все заказные элементы, связанные с продуктами продавца
                const orderItems = await OrderItem.findAll({
                    include: [{ model: Product, where: { equipmentSellerId } }]
                });
                const orderItemIds = orderItems.map(item => item.id);
                where.orderItemId = orderItemIds;
            }
            const warrantyServices = await WarrantyService.findAll({
                where,
                order: [['createdAt', 'DESC']],
                include: [{
                    model: OrderItem,
                    include: [{ model: Product }]
                }]
            });
            res.json(warrantyServices);
        } catch (error) {
            console.error('Ошибка при получении записей гарантии и сервиса:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Обновление записи гарантии и сервиса
    async updateWarrantyService(req, res) {
        try {
            const equipmentSellerId = req.user.equipmentSellerId;
            if (!equipmentSellerId) {
                return res.status(401).json({ message: 'Неавторизованный продавец' });
            }
            const { id } = req.params;
            const { warrantyPeriod, serviceConditions, serviceCenterContacts, validUntil, isExtendedWarranty } = req.body;

            const warrantyService = await WarrantyService.findByPk(id, {
                include: [{
                    model: OrderItem,
                    include: [{ model: Product }]
                }]
            });
            if (!warrantyService) {
                return res.status(404).json({ message: 'Запись гарантии и сервиса не найдена' });
            }
            // Проверка прав: заказной элемент должен принадлежать продукту данного продавца
            if (warrantyService.OrderItem.Product.equipmentSellerId !== equipmentSellerId) {
                return res.status(403).json({ message: 'Нет прав для обновления данной записи' });
            }

            const updatedData = {};
            if (warrantyPeriod !== undefined) updatedData.warrantyPeriod = warrantyPeriod;
            if (serviceConditions !== undefined) updatedData.serviceConditions = serviceConditions;
            if (serviceCenterContacts !== undefined) updatedData.serviceCenterContacts = serviceCenterContacts;
            if (validUntil !== undefined) updatedData.validUntil = validUntil;
            if (isExtendedWarranty !== undefined) {
                updatedData.isExtendedWarranty = isExtendedWarranty === 'true' || isExtendedWarranty === true;
            }

            await warrantyService.update(updatedData);
            res.json(warrantyService);
        } catch (error) {
            console.error('Ошибка при обновлении записи гарантии и сервиса:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Удаление записи гарантии и сервиса
    async deleteWarrantyService(req, res) {
        try {
            const equipmentSellerId = req.user.equipmentSellerId;
            if (!equipmentSellerId) {
                return res.status(401).json({ message: 'Неавторизованный продавец' });
            }
            const { id } = req.params;
            const warrantyService = await WarrantyService.findByPk(id, {
                include: [{
                    model: OrderItem,
                    include: [{ model: Product }]
                }]
            });
            if (!warrantyService) {
                return res.status(404).json({ message: 'Запись гарантии и сервиса не найдена' });
            }
            if (warrantyService.OrderItem.Product.equipmentSellerId !== equipmentSellerId) {
                return res.status(403).json({ message: 'Нет прав для удаления данной записи' });
            }

            await warrantyService.destroy();
            res.status(200).json({ message: 'Запись гарантии и сервиса успешно удалена' });
        } catch (error) {
            console.error('Ошибка при удалении записи гарантии и сервиса:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new WarrantyServiceController();