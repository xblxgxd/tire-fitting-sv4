const express = require('express');
const OrderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/authenticateToken');
const { Order } = require('../models/models');

const router = express.Router();

router.post('/', authenticateToken, OrderController.createOrder);

router.get('/', authenticateToken, OrderController.getUserOrders);

router.get('/sellerOrders', authenticateToken, OrderController.getEquipmentSellerOrders);

router.put('/:id/details', authenticateToken, OrderController.updateOrderDetails);

router.get('/:id', authenticateToken, OrderController.getOrderById);

router.put('/:id/status', authenticateToken, OrderController.updateOrderStatus);

router.delete('/:id', authenticateToken, OrderController.deleteOrder);

module.exports = router;
