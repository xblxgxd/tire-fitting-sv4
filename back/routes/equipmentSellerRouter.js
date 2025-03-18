const express = require('express');
const EquipmentSellerController = require('../controllers/equipmentSellerController');
const authenticateToken = require('../middleware/authenticateToken');
const OrderController = require('../controllers/orderController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/equipmentsellers');
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + file.originalname;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get('/orders', authenticateToken, OrderController.getEquipmentSellerOrders);
router.post('/registration', upload.single('logo'), EquipmentSellerController.registration);
router.post('/login', EquipmentSellerController.login);
router.get('/auth', authenticateToken, EquipmentSellerController.auth);
router.get('/', EquipmentSellerController.findAll);
router.get('/:id', EquipmentSellerController.findOne);
router.put('/:id', authenticateToken, upload.single('logo'), EquipmentSellerController.update);
router.delete('/:id', authenticateToken, EquipmentSellerController.delete);


module.exports = router;