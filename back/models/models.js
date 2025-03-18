const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Модель пользователя
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    birthDate: { type: DataTypes.DATE, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.STRING, allowNull: true },
    points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, { timestamps: true });

/* 1. Модель продавца – переименована в EquipmentSeller и расширена */
const EquipmentSeller = sequelize.define('EquipmentSeller', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    companyName: { type: DataTypes.STRING, allowNull: false },
    contactPerson: { type: DataTypes.STRING, allowNull: false },
    registrationNumber: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    logo: { type: DataTypes.STRING, allowNull: true },
    establishedYear: { type: DataTypes.INTEGER, allowNull: true },
    // Новые поля
    specialization: {
        type: DataTypes.ENUM('легковой транспорт', 'грузовой транспорт', 'мотоциклы', 'универсальное оборудование'),
        allowNull: false
    },
    serviceAvailability: { type: DataTypes.BOOLEAN, allowNull: false },
    certification: { type: DataTypes.STRING, allowNull: true },
    serviceArea: { type: DataTypes.STRING, allowNull: true },
}, { timestamps: true });

/* 2. Модель продукта – расширена дополнительными полями для шиномонтажного оборудования */
const Product = sequelize.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    brand: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: true },
    condition: {
        type: DataTypes.ENUM('new', 'used'),
        allowNull: false,
        defaultValue: 'new'
    },
    warranty: { type: DataTypes.STRING, allowNull: true },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    photo: { type: DataTypes.STRING, allowNull: true },
    documentation: { type: DataTypes.STRING, allowNull: true },
    equipmentSellerId: { type: DataTypes.INTEGER, allowNull: false },
    // Новые поля для шиномонтажного оборудования
    equipmentType: {
        type: DataTypes.ENUM('шиномонтажный стенд', 'балансировочный стенд', 'домкрат', 'компрессор', 'вулканизатор', 'инструменты', 'расходные материалы', 'подъемники'),
        allowNull: false
    },
    powerSupply: {
        type: DataTypes.ENUM('электрическое', 'пневматическое', 'гидравлическое', 'ручное'),
        allowNull: false
    },
    voltage: { type: DataTypes.STRING, allowNull: true },
    capacity: { type: DataTypes.STRING, allowNull: true },
    wheelDiameterRange: { type: DataTypes.STRING, allowNull: true },
    operatingPressure: { type: DataTypes.STRING, allowNull: true },
    dimensions: { type: DataTypes.STRING, allowNull: true },
    weight: { type: DataTypes.STRING, allowNull: true },
    countryOfOrigin: { type: DataTypes.STRING, allowNull: true },
    installationRequired: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, { timestamps: true });

/* 7. Переименование модели корзины в Cart (Basket → Cart) */
const Cart = sequelize.define('Cart', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true });

/* Переименование элемента корзины в CartItem (BasketItem → CartItem) */
const CartItem = sequelize.define('CartItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cartId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true });

/* 3. Модель заказа – расширена дополнительными полями */
const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deliveryAddress: { type: DataTypes.STRING, allowNull: false },
    totalCost: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        allowNull: false
    },
    paymentMethod: { type: DataTypes.STRING, allowNull: false },
    trackingNumber: { type: DataTypes.STRING, allowNull: true },
    orderDate: { type: DataTypes.DATE, allowNull: false },
    installationRequested: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deliveryMethod: {
        type: DataTypes.ENUM('самовывоз', 'транспортная компания', 'курьер продавца'),
        allowNull: false
    },
    estimatedDeliveryDate: { type: DataTypes.DATE, allowNull: true },
    // Обязательно объявите это поле
    equipmentSellerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { timestamps: true });


/* Модель элемента заказа */
const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    priceAtPurchase: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, { timestamps: true });

/* 6. Модель отзыва – расширена дополнительными полями для оценки специфических аспектов */
const Review = sequelize.define('Review', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    shortReview: { type: DataTypes.STRING, allowNull: false },
    reviewText: { type: DataTypes.TEXT, allowNull: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    equipmentSellerId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: true },
    // Новые поля
    easeOfInstallation: { type: DataTypes.INTEGER, allowNull: true },
    buildQuality: { type: DataTypes.INTEGER, allowNull: true },
    technicalSupport: { type: DataTypes.INTEGER, allowNull: true },
    valueForMoney: { type: DataTypes.INTEGER, allowNull: true },
}, { timestamps: true });

/* 4. Новая модель запроса консультации по оборудованию */
const ConsultationRequest = sequelize.define('ConsultationRequest', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    equipmentSellerId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: true },
    consultationDate: { type: DataTypes.DATE, allowNull: false },
    status: {
        type: DataTypes.ENUM('запрошена', 'в работе', 'проведена', 'отменена'),
        allowNull: false
    },
    userQuestion: { type: DataTypes.TEXT, allowNull: false },
    sellerResponse: { type: DataTypes.TEXT, allowNull: true },
}, { timestamps: true });

/* 5. Новая модель технической документации */
const TechnicalDocument = sequelize.define('TechnicalDocument', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    documentType: {
        type: DataTypes.ENUM('инструкция', 'паспорт изделия', 'сертификат соответствия', 'гарантийный талон', 'схема подключения'),
        allowNull: false
    },
    filePath: { type: DataTypes.STRING, allowNull: false },
    language: { type: DataTypes.STRING, allowNull: false },
    uploadedAt: { type: DataTypes.DATE, allowNull: false },
}, { timestamps: false });

/* 7. Новая модель гарантии и сервиса */
const WarrantyService = sequelize.define('WarrantyService', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderItemId: { type: DataTypes.INTEGER, allowNull: false },
    warrantyPeriod: { type: DataTypes.STRING, allowNull: false },
    serviceConditions: { type: DataTypes.TEXT, allowNull: false },
    serviceCenterContacts: { type: DataTypes.STRING, allowNull: false },
    validUntil: { type: DataTypes.DATE, allowNull: false },
    isExtendedWarranty: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, { timestamps: true });

/* 8. (Опционально) Модель аналитики продаж и предпочтений клиентов */
const Analytics = sequelize.define('Analytics', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    equipmentSellerId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    totalSales: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    consultationRequestsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    averageRating: { type: DataTypes.DECIMAL(3, 2), allowNull: true },
}, { timestamps: true });

/* Associations */

/* Пользователь и корзина (Cart) */
User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

/* Пользователь и заказы */
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

/* Продавец (EquipmentSeller) и заказы */
EquipmentSeller.hasMany(Order, { foreignKey: 'equipmentSellerId' });
Order.belongsTo(EquipmentSeller, { foreignKey: 'equipmentSellerId' });

/* Продавец (EquipmentSeller) и товары */
EquipmentSeller.hasMany(Product, { foreignKey: 'equipmentSellerId' });
Product.belongsTo(EquipmentSeller, { foreignKey: 'equipmentSellerId' });

/* Продавец (EquipmentSeller) и отзывы */
EquipmentSeller.hasMany(Review, { foreignKey: 'equipmentSellerId' });
Review.belongsTo(EquipmentSeller, { foreignKey: 'equipmentSellerId' });

/* Заказ и отзыв */
Order.hasOne(Review, { foreignKey: 'orderId' });
Review.belongsTo(Order, { foreignKey: 'orderId' });

/* Связь «многие-ко-многим» между корзиной (Cart) и товаром через CartItem */
Cart.belongsToMany(Product, { through: CartItem, foreignKey: 'cartId', otherKey: 'productId' });
Product.belongsToMany(Cart, { through: CartItem, foreignKey: 'productId', otherKey: 'cartId' });

/* Связь «многие-ко-многим» между заказом и товаром через OrderItem */
Order.belongsToMany(Product, { through: OrderItem, foreignKey: 'orderId', otherKey: 'productId' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: 'productId', otherKey: 'orderId' });

/* Дополнительные связи для OrderItem */
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

/* Связи для CartItem */
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

/* Пользователь и отзывы */
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

/* Associations для ConsultationRequest */
User.hasMany(ConsultationRequest, { foreignKey: 'userId' });
ConsultationRequest.belongsTo(User, { foreignKey: 'userId' });
EquipmentSeller.hasMany(ConsultationRequest, { foreignKey: 'equipmentSellerId' });
ConsultationRequest.belongsTo(EquipmentSeller, { foreignKey: 'equipmentSellerId' });
Product.hasMany(ConsultationRequest, { foreignKey: 'productId' });
ConsultationRequest.belongsTo(Product, { foreignKey: 'productId' });

/* Associations для TechnicalDocument */
Product.hasMany(TechnicalDocument, { foreignKey: 'productId' });
TechnicalDocument.belongsTo(Product, { foreignKey: 'productId' });

/* Associations для WarrantyService */
OrderItem.hasOne(WarrantyService, { foreignKey: 'orderItemId' });
WarrantyService.belongsTo(OrderItem, { foreignKey: 'orderItemId' });

/* Associations для Analytics */
EquipmentSeller.hasMany(Analytics, { foreignKey: 'equipmentSellerId' });
Analytics.belongsTo(EquipmentSeller, { foreignKey: 'equipmentSellerId' });
Product.hasMany(Analytics, { foreignKey: 'productId' });
Analytics.belongsTo(Product, { foreignKey: 'productId' });

Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
    User,
    EquipmentSeller,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Review,
    ConsultationRequest,
    TechnicalDocument,
    WarrantyService,
    Analytics,
    sequelize,
};