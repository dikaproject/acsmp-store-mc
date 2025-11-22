const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { settingValidation } = require('../middleware/validations');

router.get('/', settingController.getAll);
router.get('/:key', settingController.getByKey);
router.post('/', authenticate, isAdmin, settingValidation.upsert, settingController.upsert);
router.post('/bulk', authenticate, isAdmin, settingValidation.bulkUpsert, settingController.bulkUpsert);
router.delete('/:key', authenticate, isAdmin, settingController.delete);

module.exports = router;
