const express = require('express');
const router = express.Router();
const TechnicalDocumentController = require('../controllers/technicalDocumentController');
const authenticateToken = require('../middleware/authenticateToken');
const multer = require('multer');

// Используем multer с memoryStorage, чтобы получать req.file.buffer
const upload = multer({ storage: multer.memoryStorage() });

// Создание технического документа (только для авторизованного продавца)
router.post('/', authenticateToken, upload.single('file'), TechnicalDocumentController.createDocument);

// Получение технического документа по ID
router.get('/:id', TechnicalDocumentController.getDocumentById);

// Получение списка технических документов (с фильтрацией по productId или equipmentSellerId через query-параметры)
router.get('/', TechnicalDocumentController.getAllDocuments);

// Обновление технического документа (только для продавца)
router.put('/:id', authenticateToken, upload.single('file'), TechnicalDocumentController.updateDocument);

// Удаление технического документа (только для продавца)
router.delete('/:id', authenticateToken, TechnicalDocumentController.deleteDocument);

module.exports = router;