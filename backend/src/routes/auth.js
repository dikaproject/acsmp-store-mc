const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { body } = require('express-validator');
const { validate } = require('../middleware/validations');

// Player login
router.post('/login/player', [
  body('minecraftName')
    .trim()
    .notEmpty().withMessage('Minecraft name is required')
    .matches(/^[a-zA-Z0-9_]{3,16}$/).withMessage('Invalid Minecraft name format'),
  validate
], authController.playerLogin);

// Admin login - ✅ Accept 'email' instead of 'username'
router.post('/login', [
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], authController.adminLogin);

// Get current user
router.get('/me', authenticate, authController.getCurrentUser);

// Test RCON connection (admin only)
router.get('/test-rcon', authenticate, isAdmin, authController.testRconConnection);

module.exports = router;