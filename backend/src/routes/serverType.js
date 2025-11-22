const express = require('express');
const router = express.Router();
const serverTypeController = require('../controllers/serverTypeController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { serverTypeValidation } = require('../middleware/validations');
const upload = require('../config/multer');

router.get('/', serverTypeController.getAll);
router.get('/:id', serverTypeController.getById);
router.post('/', authenticate, isAdmin, upload.single('image'), serverTypeValidation.create, serverTypeController.create);
router.put('/:id', authenticate, isAdmin, upload.single('image'), serverTypeValidation.update, serverTypeController.update);
router.delete('/:id', authenticate, isAdmin, serverTypeController.delete);

module.exports = router;
