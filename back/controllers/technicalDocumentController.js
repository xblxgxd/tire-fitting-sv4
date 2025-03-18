const { TechnicalDocument, Product } = require('../models/models');
const fs = require('fs');
const path = require('path');

class TechnicalDocumentController {
    // Создание нового технического документа (только для продавца)
    async createDocument(req, res) {
        try {
            const equipmentSellerId = req.user.equipmentSellerId;
            if (!equipmentSellerId) {
                return res.status(401).json({ message: 'Неавторизованный продавец' });
            }
            const { productId, documentType, language } = req.body;
            if (!productId || !documentType || !language) {
                return res.status(400).json({ message: 'Заполните все обязательные поля' });
            }

            // Проверяем, что продукт существует и принадлежит продавцу
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Продукт не найден' });
            }
            if (product.equipmentSellerId !== equipmentSellerId) {
                return res.status(403).json({ message: 'Нет прав для добавления документа к этому продукту' });
            }

            if (!req.file) {
                return res.status(400).json({ message: 'Файл технической документации обязателен' });
            }
            const uploadDir = path.join(__dirname, '../uploads/technicalDocuments');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const fileName = `${Date.now()}_${req.file.originalname}`;
            const filePath = `/uploads/technicalDocuments/${fileName}`;
            fs.writeFileSync(path.join(uploadDir, fileName), req.file.buffer);

            const uploadedAt = new Date();

            const document = await TechnicalDocument.create({
                productId,
                documentType,
                filePath,
                language,
                uploadedAt,
            });

            res.status(201).json(document);
        } catch (error) {
            console.error('Ошибка при создании технического документа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Получение технического документа по ID
    async getDocumentById(req, res) {
        try {
            const { id } = req.params;
            const document = await TechnicalDocument.findByPk(id, {
                include: [{ model: Product, attributes: ['name', 'brand', 'model'] }],
            });
            if (!document) {
                return res.status(404).json({ message: 'Технический документ не найден' });
            }
            res.json(document);
        } catch (error) {
            console.error('Ошибка при получении технического документа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Получение всех технических документов (с возможной фильтрацией по productId или equipmentSellerId)
    async getAllDocuments(req, res) {
        try {
            const { productId, equipmentSellerId } = req.query;
            const where = {};
            if (productId) where.productId = productId;
            // Если передан equipmentSellerId, находим все продукты данного продавца и фильтруем документы по productId
            if (equipmentSellerId) {
                const products = await Product.findAll({ where: { equipmentSellerId } });
                const productIds = products.map(p => p.id);
                where.productId = productIds;
            }

            const documents = await TechnicalDocument.findAll({
                where,
                include: [{ model: Product, attributes: ['name', 'brand', 'model'] }],
                order: [['uploadedAt', 'DESC']],
            });
            res.json(documents);
        } catch (error) {
            console.error('Ошибка при получении технических документов:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Обновление технического документа (только продавец может обновлять свой документ)
    async updateDocument(req, res) {
        try {
            const equipmentSellerId = req.user.equipmentSellerId;
            if (!equipmentSellerId) {
                return res.status(401).json({ message: 'Неавторизованный продавец' });
            }

            const { id } = req.params;
            const { documentType, language } = req.body;

            const document = await TechnicalDocument.findByPk(id, {
                include: [{ model: Product }],
            });
            if (!document) {
                return res.status(404).json({ message: 'Технический документ не найден' });
            }
            if (document.Product.equipmentSellerId !== equipmentSellerId) {
                return res.status(403).json({ message: 'Нет прав для обновления этого документа' });
            }

            const updatedData = {};
            if (documentType) updatedData.documentType = documentType;
            if (language) updatedData.language = language;

            // Если загружен новый файл, обновляем filePath и дату загрузки
            if (req.file) {
                const uploadDir = path.join(__dirname, '../uploads/technicalDocuments');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const fileName = `${Date.now()}_${req.file.originalname}`;
                const newFilePath = `/uploads/technicalDocuments/${fileName}`;
                fs.writeFileSync(path.join(uploadDir, fileName), req.file.buffer);
                updatedData.filePath = newFilePath;
                updatedData.uploadedAt = new Date();
            }

            await document.update(updatedData);
            res.json(document);
        } catch (error) {
            console.error('Ошибка при обновлении технического документа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // Удаление технического документа (только продавец, которому принадлежит документ)
    async deleteDocument(req, res) {
        try {
            const equipmentSellerId = req.user.equipmentSellerId;
            if (!equipmentSellerId) {
                return res.status(401).json({ message: 'Неавторизованный продавец' });
            }

            const { id } = req.params;
            const document = await TechnicalDocument.findByPk(id, {
                include: [{ model: Product }],
            });
            if (!document) {
                return res.status(404).json({ message: 'Технический документ не найден' });
            }
            if (document.Product.equipmentSellerId !== equipmentSellerId) {
                return res.status(403).json({ message: 'Нет прав для удаления этого документа' });
            }

            await document.destroy();
            res.status(200).json({ message: 'Технический документ успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении технического документа:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new TechnicalDocumentController();