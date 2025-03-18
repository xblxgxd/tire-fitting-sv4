const Router = require('express').Router;
const router = new Router();

router.use('/users', require('./userRouter'));
router.use('/reviews', require('./reviewRouter'));
router.use('/products', require('./productRouter'));
router.use('/equipmentsellers', require('./equipmentSellerRouter'));
router.use('/orders', require('./orderRouter'));
router.use('/carts', require('./cartRouter'));
router.use('/technicalDocuments', require('./technicalDocumentRouter'));
router.use('/consultationRequests', require('./consultationRequestRouter'));
router.use('/warrantyServices', require('./warrantyServiceRouter'));


module.exports = router;