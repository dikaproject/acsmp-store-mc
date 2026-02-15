const express = require('express');
const router = express.Router();
const linktreeController = require('../controllers/linktreeController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { linktreeValidation } = require('../middleware/validations');
const upload = require('../config/multer');

// Public
router.get('/', linktreeController.getAll);

// Admin
router.get('/admin', authenticate, isAdmin, linktreeController.getAllAdmin);
router.post('/upload-bg', authenticate, isAdmin, upload.single('image'), linktreeController.uploadBackground);
router.delete('/delete-bg', authenticate, isAdmin, linktreeController.deleteBackground);
router.get('/:id', authenticate, isAdmin, linktreeController.getById);
router.post('/', authenticate, isAdmin, linktreeValidation.create, linktreeController.create);
router.put('/reorder', authenticate, isAdmin, linktreeController.reorder);
router.put('/:id', authenticate, isAdmin, linktreeValidation.update, linktreeController.update);
router.delete('/:id', authenticate, isAdmin, linktreeController.delete);

module.exports = router;
