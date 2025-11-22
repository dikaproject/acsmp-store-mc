const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { galleryValidation } = require('../middleware/validations');
const upload = require('../config/multer');

router.get('/', galleryController.getAll);
router.get('/:id', galleryController.getById);
router.post('/', authenticate, isAdmin, upload.single('image'), galleryValidation.create, galleryController.create);
router.put('/:id', authenticate, isAdmin, upload.single('image'), galleryValidation.update, galleryController.update);
router.delete('/:id', authenticate, isAdmin, galleryController.delete);

module.exports = router;
