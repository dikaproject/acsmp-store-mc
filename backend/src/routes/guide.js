const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { guideValidation } = require('../middleware/validations');
const upload = require('../config/multer');

router.get('/', guideController.getAll);
router.get('/slug/:slug', guideController.getBySlug);
router.get('/:id', guideController.getById);
router.post('/', authenticate, isAdmin, upload.single('image'), guideValidation.create, guideController.create);
router.post('/upload-image', authenticate, isAdmin, upload.single('image'), guideController.uploadImage);
router.put('/:id', authenticate, isAdmin, upload.single('image'), guideValidation.update, guideController.update);
router.delete('/:id', authenticate, isAdmin, guideController.delete);

module.exports = router;
