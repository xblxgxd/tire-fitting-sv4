const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');
const authenticateToken = require('../middleware/authenticateToken');

// Создание новой записи аналитики (только для авторизованного продавца)
router.post('/', authenticateToken, AnalyticsController.createAnalytics);

// Получение записи аналитики по ID
router.get('/:id', AnalyticsController.getAnalyticsById);

// Получение списка записей аналитики с фильтрацией (по equipmentSellerId и productId)
router.get('/', AnalyticsController.getAllAnalytics);

// Обновление записи аналитики (только для авторизованного продавца)
router.put('/:id', authenticateToken, AnalyticsController.updateAnalytics);

// Удаление записи аналитики (только для авторизованного продавца)
router.delete('/:id', authenticateToken, AnalyticsController.deleteAnalytics);

module.exports = router;