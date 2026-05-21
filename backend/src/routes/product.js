const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { productValidation } = require('../middleware/validations');
const upload = require('../config/multer');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authenticate, isAdmin, upload.single('image'), productValidation.create, productController.create);
router.put('/:id', authenticate, isAdmin, upload.single('image'), productValidation.update, productController.update);
router.patch('/bulk-status', authenticate, isAdmin, productController.bulkUpdateStatus);
router.delete('/:id', authenticate, isAdmin, productController.delete);

module.exports = router;
