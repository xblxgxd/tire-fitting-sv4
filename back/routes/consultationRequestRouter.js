const express = require('express');
const router = express.Router();
const ConsultationRequestController = require('../controllers/сonsultationRequestController');
const authenticateToken = require('../middleware/authenticateToken');

// Создание нового запроса консультации (пользователь должен быть авторизован)
router.post('/', authenticateToken, ConsultationRequestController.createConsultationRequest);

// Получение запроса консультации по ID
router.get('/:id', ConsultationRequestController.getConsultationRequestById);

// Получение списка запросов консультации (с возможной фильтрацией по userId и equipmentSellerId)
router.get('/', ConsultationRequestController.getAllConsultationRequests);

// Обновление запроса консультации (пользователь или продавец в зависимости от прав)
router.put('/:id', authenticateToken, ConsultationRequestController.updateConsultationRequest);

// Удаление запроса консультации (только владелец запроса)
router.delete('/:id', authenticateToken, ConsultationRequestController.deleteConsultationRequest);

module.exports = router;