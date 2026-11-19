const express = require('express');
const router = express.Router();
const leaderboardEntryController = require('../controllers/leaderboardEntryController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Admin only: manual donation adjustments for the public leaderboard
router.use(authenticate, isAdmin);

router.get('/', leaderboardEntryController.getAll);
router.post('/', leaderboardEntryController.create);
router.put('/:id', leaderboardEntryController.update);
router.delete('/:id', leaderboardEntryController.delete);

module.exports = router;
