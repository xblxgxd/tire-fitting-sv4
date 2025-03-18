const { ConsultationRequest, User, EquipmentSeller, Product } = require('../models/models');

class ConsultationRequestController {
    // Создание нового запроса консультации (создаётся пользователем)
    async createConsultationRequest(req, res) {
        try {
            const userId = req.user.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Неавторизованный пользователь' });
            }
            const { equipmentSellerId, productId, consultationDate, userQuestion } = req.body;
            if (!equipmentSellerId || !consultationDate || !userQuestion) {
                return res.status(400).json({ message: 'Заполните все обязательные поля' });
            }

            const newRequest = await ConsultationRequest.create({
                userId,
                equipmentSellerId,
                productId: productId || null,
                consultationDate,
                status: 'запрошена',  // по умолчанию
                userQuestion,
                sellerResponse: null,
            });

            res.status(201).json(newRequest);
        } catch (error) {
            console.error('Ошибка при создании запроса консультации:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Получение запроса консультации по ID
    async getConsultationRequestById(req, res) {
        try {
            const { id } = req.params;
            const request = await ConsultationRequest.findByPk(id, {
                include: [
                    { model: User, attributes: ['firstName', 'lastName', 'email'] },
                    { model: EquipmentSeller, attributes: ['companyName', 'contactPerson'] },
                    { model: Product, attributes: ['name', 'price'] },
                ],
            });
            if (!request) {
                return res.status(404).json({ message: 'Запрос консультации не найден' });
            }
            res.json(request);
        } catch (error) {
            console.error('Ошибка при получении запроса консультации:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Получение списка запросов консультации с возможной фильтрацией
    async getAllConsultationRequests(req, res) {
        try {
            const { userId, equipmentSellerId } = req.query;
            const where = {};
            if (userId) where.userId = userId;
            if (equipmentSellerId) where.equipmentSellerId = equipmentSellerId;
            const requests = await ConsultationRequest.findAll({
                where,
                include: [
                    { model: User, attributes: ['firstName', 'lastName', 'email'] },
                    { model: EquipmentSeller, attributes: ['companyName', 'contactPerson'] },
                    { model: Product, attributes: ['name', 'price'] },
                ],
                order: [['consultationDate', 'DESC']],
            });
            res.json(requests);
        } catch (error) {
            console.error('Ошибка при получении запросов консультации:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Обновление запроса консультации
    async updateConsultationRequest(req, res) {
        try {
            const { id } = req.params;
            // Возможное обновление:
            // - Пользователь может обновлять: userQuestion, consultationDate.
            // - Продавец может обновлять: status, sellerResponse.
            const { status, sellerResponse, userQuestion, consultationDate } = req.body;
            const request = await ConsultationRequest.findByPk(id);
            if (!request) {
                return res.status(404).json({ message: 'Запрос консультации не найден' });
            }

            const currentUserId = req.user.userId;
            const currentSellerId = req.user.equipmentSellerId;

            if (currentUserId && request.userId === currentUserId) {
                // Обновление запроса пользователем
                const updatedData = {};
                if (userQuestion !== undefined) updatedData.userQuestion = userQuestion;
                if (consultationDate !== undefined) updatedData.consultationDate = consultationDate;
                // Пользователь не может изменять статус или ответ продавца
                if (status || sellerResponse) {
                    return res.status(403).json({ message: 'Пользователь не может обновлять статус или ответ продавца' });
                }
                await request.update(updatedData);
                return res.json(request);
            } else if (currentSellerId && request.equipmentSellerId === currentSellerId) {
                // Обновление запроса продавцом
                const updatedData = {};
                if (status) updatedData.status = status;
                if (sellerResponse !== undefined) updatedData.sellerResponse = sellerResponse;
                await request.update(updatedData);
                return res.json(request);
            } else {
                return res.status(403).json({ message: 'Нет доступа для обновления этого запроса' });
            }
        } catch (error) {
            console.error('Ошибка при обновлении запроса консультации:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Удаление запроса консультации
    async deleteConsultationRequest(req, res) {
        try {
            const { id } = req.params;
            const request = await ConsultationRequest.findByPk(id);
            if (!request) {
                return res.status(404).json({ message: 'Запрос консультации не найден' });
            }

            const currentUserId = req.user.userId;
            const currentSellerId = req.user.equipmentSellerId;
            // Удалять запрос может либо владелец (пользователь), либо продавец, к которому относится запрос
            if (currentUserId && request.userId === currentUserId) {
                // пользователь — владелец запроса
            } else if (currentSellerId && request.equipmentSellerId === currentSellerId) {
                // продавец — владелец запроса
            } else {
                return res.status(403).json({ message: 'Нет прав для удаления этого запроса' });
            }

            await request.destroy();
            res.status(200).json({ message: 'Запрос консультации успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении запроса консультации:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new ConsultationRequestController();