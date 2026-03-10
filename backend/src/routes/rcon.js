const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const rconController = require('../controllers/rconController');

// All RCON routes require admin auth
router.use(authenticate, isAdmin);

router.get('/', rconController.getAll);
router.get('/:id', rconController.getById);
router.post('/', rconController.create);
router.put('/:id', rconController.update);
router.delete('/:id', rconController.remove);
router.post('/:id/test', rconController.testConnection);

module.exports = router;
