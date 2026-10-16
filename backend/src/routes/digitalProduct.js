const express = require('express');
const controller = require('../controllers/digitalProductController');
const { authenticate, isAdmin } = require('../middleware/auth');
const validation = require('../middleware/digitalProductValidation');
const upload = require('../config/multer');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authenticate, isAdmin, upload.single('image'), validation.create, controller.create);
router.put('/:id', authenticate, isAdmin, upload.single('image'), validation.update, controller.update);
router.delete('/:id', authenticate, isAdmin, controller.delete);

module.exports = router;
