const { EquipmentSeller, Product, Review, User, sequelize } = require('../models/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

class EquipmentSellerController {
    async registration(req, res) {
        try {
            const {
                companyName,
                contactPerson,
                registrationNumber,
                phone,
                description,
                email,
                password,
                address,
                establishedYear,
                specialization,
                serviceAvailability,
                certification,
                serviceArea
            } = req.body;

            const existingSeller = await EquipmentSeller.findOne({ where: { email } });
            if (existingSeller) {
                return res.status(400).json({ message: 'Продавец с таким email уже существует' });
            }

            const passwordHash = await bcrypt.hash(password, 12);

            let logoPath = null;
            if (req.file) {
                const uploadDir = path.join(__dirname, '../uploads/equipmentsellers');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                logoPath = `/uploads/equipmentsellers/${req.file.filename}`;
            }

            const seller = await EquipmentSeller.create({
                companyName,
                contactPerson,
                registrationNumber,
                phone,
                description,
                email,
                password: passwordHash,
                address,
                establishedYear: establishedYear ? parseInt(establishedYear) : null,
                specialization,
                serviceAvailability: serviceAvailability === 'true' || serviceAvailability === true,
                certification,
                serviceArea,
                logo: logoPath,
            });

            res.status(201).json(seller);
        } catch (error) {
            console.error('Ошибка при регистрации продавца:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const seller = await EquipmentSeller.findOne({ where: { email } });
            if (!seller) {
                return res.status(404).json({ message: 'Продавец не найден' });
            }

            const isMatch = await bcrypt.compare(password, seller.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }

            const token = jwt.sign(
                { equipmentSellerId: seller.id },
                process.env.JWT_SECRET || 'your_jwt_secret_key',
                { expiresIn: '24h' }
            );

            res.json({ token, seller });
        } catch (error) {
            console.error('Ошибка при входе продавца:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async auth(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Не авторизован' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
            const seller = await EquipmentSeller.findByPk(decoded.equipmentSellerId);

            res.json(seller);
        } catch (error) {
            console.error('Ошибка при аутентификации продавца:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async findOne(req, res) {
        try {
            const { id } = req.params;

            const seller = await EquipmentSeller.findByPk(id, {
                include: [
                    { model: Product },
                    {
                        model: Review,
                        include: [{ model: User, attributes: ['firstName', 'lastName'] }]
                    },
                ],
            });

            if (!seller) {
                return res.status(404).json({ message: 'Продавец не найден' });
            }

            res.json(seller);
        } catch (error) {
            console.error('Ошибка при получении продавца:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async findAll(req, res) {
        try {
            const { name, address, averageRating, limit, offset } = req.query;

            const whereConditions = {};
            if (name) {
                whereConditions.companyName = { [Op.iLike]: `%${name}%` };
            }
            if (address) {
                whereConditions.address = { [Op.iLike]: `%${address}%` };
            }

            let havingConditions = null;
            if (averageRating) {
                havingConditions = sequelize.where(
                    sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('Reviews.rating')), 1),
                    { [Op.gte]: parseFloat(averageRating) }
                );
            }

            const { rows, count } = await EquipmentSeller.findAndCountAll({
                where: whereConditions,
                include: [
                    {
                        model: Review,
                        attributes: [],
                    },
                ],
                attributes: {
                    include: [
                        [
                            sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('Reviews.rating')), 1),
                            'averageRating'
                        ],
                        [
                            sequelize.fn('COUNT', sequelize.col('Reviews.id')),
                            'reviewCount'
                        ],
                    ],
                },
                group: ['EquipmentSeller.id'],
                having: havingConditions,
                order: [['companyName', 'ASC']],
                limit: limit ? parseInt(limit) : undefined,
                offset: offset ? parseInt(offset) : undefined,
                subQuery: false,
            });

            res.json({
                sellers: rows,
                total: count.length,
            });
        } catch (error) {
            console.error('Ошибка при получении списка продавцов:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async update(req, res) {
        try {
            const {
                companyName,
                contactPerson,
                registrationNumber,
                phone,
                description,
                email,
                password,
                address,
                establishedYear,
                specialization,
                serviceAvailability,
                certification,
                serviceArea
            } = req.body;
            const sellerId = req.params.id;

            const seller = await EquipmentSeller.findByPk(sellerId);
            if (!seller) {
                return res.status(404).json({ message: 'Продавец не найден' });
            }

            let updatedData = {
                companyName,
                contactPerson,
                registrationNumber,
                phone,
                description,
                email,
                address,
                establishedYear: establishedYear ? parseInt(establishedYear) : seller.establishedYear,
                specialization,
                serviceAvailability: serviceAvailability === 'true' || serviceAvailability === true,
                certification,
                serviceArea
            };

            if (password) {
                updatedData.password = await bcrypt.hash(password, 12);
            }

            if (req.file) {
                const uploadDir = path.join(__dirname, '../uploads/equipmentsellers');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                const logoPath = `/uploads/equipmentsellers/${sellerId}_${req.file.originalname}`;
                fs.writeFileSync(
                    path.join(uploadDir, `${sellerId}_${req.file.originalname}`),
                    fs.readFileSync(req.file.path)
                );
                updatedData.logo = logoPath;
            }

            await seller.update(updatedData);

            res.json(seller);
        } catch (error) {
            console.error('Ошибка при обновлении продавца:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async delete(req, res) {
        try {
            const seller = await EquipmentSeller.findByPk(req.params.id);
            if (!seller) {
                return res.status(404).json({ message: 'Продавец не найден' });
            }

            await seller.destroy();

            res.status(200).json({ message: 'Продавец успешно удалён' });
        } catch (error) {
            console.error('Ошибка при удалении продавца:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
}

module.exports = new EquipmentSellerController();