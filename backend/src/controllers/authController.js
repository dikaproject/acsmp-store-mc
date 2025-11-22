const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const commandService = require('../services/commandService');
const prisma = new PrismaClient();

// Player Login (verify minecraft name only, no database)
exports.playerLogin = async (req, res, next) => {
  try {
    const { minecraftName } = req.body;

    if (!minecraftName) {
      return res.status(400).json({
        success: false,
        message: 'Minecraft name is required'
      });
    }

    // Validate minecraft name format
    const minecraftRegex = /^[a-zA-Z0-9_]{3,16}$/;
    if (!minecraftRegex.test(minecraftName)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Minecraft name format (3-16 characters, alphanumeric & underscore only)'
      });
    }

    // Verify player exists in server via RCON
    const verification = await commandService.verifyPlayerExists(minecraftName);

    if (!verification.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to verify player. Please try again later.',
        details: verification.error
      });
    }

    if (!verification.exists) {
      return res.status(404).json({
        success: false,
        message: 'Player not found in server. Please join the server at least once before logging in.',
        details: verification.message
      });
    }

    // Generate simple token with minecraft name only (no user ID needed)
    const token = jwt.sign(
      { 
        minecraftName: minecraftName,
        role: 'PLAYER'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        minecraftName: minecraftName,
        role: 'PLAYER',
        token,
        verification: {
          method: verification.method,
          message: verification.message
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Admin Login - ✅ Use 'email' instead of 'username'
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body; // ✅ Changed from username to email

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email } // ✅ Use email directly
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get current user info
exports.getCurrentUser = async (req, res, next) => {
  try {
    // If player, return from token
    if (req.user.role === 'PLAYER') {
      return res.json({
        success: true,
        data: {
          minecraftName: req.user.minecraftName,
          role: 'PLAYER'
        }
      });
    }

    // If admin, get from database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Test RCON connection (admin only)
exports.testRconConnection = async (req, res, next) => {
  try {
    const result = await commandService.testConnection();
    
    res.json({
      success: result.success,
      message: result.message,
      data: {
        output: result.output,
        error: result.error
      }
    });
  } catch (error) {
    next(error);
  }
};