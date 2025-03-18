const { Product, EquipmentSeller } = require('../models/models');
const fs = require('fs');
const path = require('path');

class ProductController {
    async create(req, res) {
        try {
            // Извлекаем стандартные поля товара и новые поля для шиномонтажного оборудования
            const {
                name,
                description,
                price,
                category,
                brand,
                model,
                condition,
                warranty,
                stock,
                equipmentType,
                powerSupply,
                voltage,
                capacity,
                wheelDiameterRange,
                operatingPressure,
                dimensions,
                weight,
                countryOfOrigin,
                installationRequired
            } = req.body;

            // Используем идентификатор продавца из токена (у продавца теперь поле equipmentSellerId)
            const equipmentSellerId = req.user.equipmentSellerId;
            if (!equipmentSellerId) {
                return res.status(403).json({ message: 'Нет прав для создания товара' });
            }

            const seller = await EquipmentSeller.findByPk(equipmentSellerId);
            if (!seller) {
                return res.status(404).json({ message: 'Продавец не найден' });
            }

            // Обрабатываем файлы (фото и техническую документацию), если они были загружены
            const photoPath = req.files && req.files.photo
                ? `/uploads/products/${req.files.photo[0].filename}`
                : null;
            const documentationPath = req.files && req.files.documentation
                ? `/uploads/products/${req.files.documentation[0].filename}`
                : null;

            const product = await Product.create({
                name,
                description,
                price,
                category,
                brand,
                model,
                condition,   // по умолчанию 'new', если не передано
                warranty,
                stock,
                equipmentSellerId,
                photo: photoPath,
                documentation: documentationPath,
                equipmentType,
                powerSupply,
                voltage,
                capacity,
                wheelDiameterRange,
                operatingPressure,
                dimensions,
                weight,
                countryOfOrigin,
                installationRequired: installationRequired === 'true' || installationRequired === true
            });

            res.status(201).json(product);
        } catch (error) {
            console.error('Ошибка при создании продукта:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async findOne(req, res) {
        try {
            const product = await Product.findByPk(req.params.id, {
                include: [{ model: EquipmentSeller }],
            });
            if (!product) {
                return res.status(404).json({ message: 'Продукт не найден' });
            }
            res.json(product);
        } catch (error) {
            console.error('Ошибка при получении продукта:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async findAll(req, res) {
        try {
            const products = await Product.findAll({
                include: [{ model: EquipmentSeller }],
            });
            res.json(products);
        } catch (error) {
            console.error('Ошибка при получении списка продуктов:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async update(req, res) {
        try {
            // Извлекаем обновляемые поля, включая новые характеристики оборудования
            const {
                name,
                description,
                price,
                category,
                brand,
                model,
                condition,
                warranty,
                stock,
                equipmentType,
                powerSupply,
                voltage,
                capacity,
                wheelDiameterRange,
                operatingPressure,
                dimensions,
                weight,
                countryOfOrigin,
                installationRequired
            } = req.body;
            const productId = req.params.id;

            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Продукт не найден' });
            }

            let updatedData = {
                name,
                description,
                price,
                category,
                brand,
                model,
                condition,
                warranty,
                stock,
                equipmentType,
                powerSupply,
                voltage,
                capacity,
                wheelDiameterRange,
                operatingPressure,
                dimensions,
                weight,
                countryOfOrigin,
                installationRequired: installationRequired === 'true' || installationRequired === true
            };

            // Обновление фото, если загружен новый файл
            if (req.files && req.files.photo) {
                const uploadDir = path.join(__dirname, '../uploads/products');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const photoPath = `/uploads/products/${productId}_${req.files.photo[0].originalname}`;
                const filePath = path.join(uploadDir, `${productId}_${req.files.photo[0].originalname}`);
                fs.writeFileSync(filePath, fs.readFileSync(req.files.photo[0].path));
                updatedData.photo = photoPath;
            }

            // Обновление документации, если загружен новый файл
            if (req.files && req.files.documentation) {
                const uploadDir = path.join(__dirname, '../uploads/products');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const documentationPath = `/uploads/products/${productId}_${req.files.documentation[0].originalname}`;
                const filePath = path.join(uploadDir, `${productId}_${req.files.documentation[0].originalname}`);
                fs.writeFileSync(filePath, fs.readFileSync(req.files.documentation[0].path));
                updatedData.documentation = documentationPath;
            }

            await product.update(updatedData);

            res.json(product);
        } catch (error) {
            console.error('Ошибка при обновлении продукта:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async delete(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Продукт не найден' });
            }

            await product.destroy();

            res.status(200).json({ message: 'Продукт успешно удален' });
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async findByEquipmentSeller(req, res) {
        try {
            const { equipmentSellerId } = req.params;

            const seller = await EquipmentSeller.findByPk(equipmentSellerId);
            if (!seller) {
                return res.status(404).json({ message: 'Продавец не найден' });
            }

            const products = await Product.findAll({ where: { equipmentSellerId } });

            res.json(products);
        } catch (error) {
            console.error('Ошибка при получении товаров продавца:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new ProductController();