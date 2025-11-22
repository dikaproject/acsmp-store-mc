const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // If player (no database user)
    if (decoded.role === 'PLAYER') {
      req.user = {
        minecraftName: decoded.minecraftName,
        role: 'PLAYER'
      };
      return next();
    }

    // If admin (has database user)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Invalid token.' 
    });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied. Admin only.' 
    });
  }
  next();
};

const isPlayer = (req, res, next) => {
  if (!req.user || (req.user.role !== 'PLAYER' && req.user.role !== 'ADMIN')) {
    return res.status(403).json({ 
      success: false,
      message: 'Access denied. Player login required.' 
    });
  }
  next();
};

module.exports = { 
  authenticate, 
  isAdmin, 
  isPlayer,
  auth: authenticate, 
  adminOnly: isAdmin 
};