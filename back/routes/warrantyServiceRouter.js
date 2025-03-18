const express = require('express');
const router = express.Router();
const WarrantyServiceController = require('../controllers/warrantyServiceController');
const authenticateToken = require('../middleware/authenticateToken');

// Создание записи гарантии и сервиса (только для авторизованного продавца)
router.post('/', authenticateToken, WarrantyServiceController.createWarrantyService);

// Получение записи гарантии и сервиса по ID
router.get('/:id', WarrantyServiceController.getWarrantyServiceById);

// Получение списка записей гарантии и сервиса с возможной фильтрацией (по orderItemId или equipmentSellerId)
router.get('/', WarrantyServiceController.getAllWarrantyServices);

// Обновление записи гарантии и сервиса (только для авторизованного продавца)
router.put('/:id', authenticateToken, WarrantyServiceController.updateWarrantyService);

// Удаление записи гарантии и сервиса (только для авторизованного продавца)
router.delete('/:id', authenticateToken, WarrantyServiceController.deleteWarrantyService);

module.exports = router;