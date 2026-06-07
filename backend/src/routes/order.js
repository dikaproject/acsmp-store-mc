const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, isAdmin, isPlayer } = require('../middleware/auth');
const { orderValidation } = require('../middleware/validations');
const { orderLimiter, paymentStatusLimiter } = require('../middleware/rateLimiters');

router.get('/stats', authenticate, isAdmin, orderController.getStats);
router.get('/leaderboard', orderController.getLeaderboard);
router.get('/payment-channels', orderController.getPaymentChannels);
router.get('/my', authenticate, isPlayer, orderController.getMyOrders);
router.get('/', authenticate, isAdmin, orderController.getAll);
router.get('/code/:orderCode', orderController.getByOrderCode);
router.get('/:id', orderController.getById);
router.post('/', authenticate, isPlayer, orderLimiter, orderValidation.create, orderController.create);
router.post('/webhook', orderController.handleWebhook);
router.get('/:id/payment-status', paymentStatusLimiter, orderController.checkPaymentStatus);
router.patch('/:id/status', authenticate, isAdmin, orderValidation.updateStatus, orderController.updateStatus);

module.exports = router;
