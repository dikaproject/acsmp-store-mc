const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public: validate a code
router.post('/validate', voucherController.validate);

// Admin only
router.get('/', authenticate, isAdmin, voucherController.getAll);
router.post('/', authenticate, isAdmin, voucherController.create);
router.put('/:id', authenticate, isAdmin, voucherController.update);
router.delete('/:id', authenticate, isAdmin, voucherController.delete);

module.exports = router;
