// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const serverTypeRoutes = require('./routes/serverType');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const galleryRoutes = require('./routes/gallery');
const guideRoutes = require('./routes/guide');
const settingRoutes = require('./routes/setting');
const linktreeRoutes = require('./routes/linktree');
const rconRoutes = require('./routes/rcon');
const skinRoutes = require('./routes/skin');

const app = express();
const port = process.env.PORT || 5001;


const corsOptions = {
  origin: true,                 
  credentials: true,             
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 
app.use(express.json());

// Static files - serve both /uploads and /api/uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SSSMC Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      serverTypes: '/api/server-types',
      products: '/api/products',
      orders: '/api/orders',
      gallery: '/api/gallery',
      guides: '/api/guides',
      settings: '/api/settings',
      health: '/api/health'
    }
  });
});
app.get('/api/health', (req, res) => {
  res.json({ ok: true, t: Date.now() });
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/server-types', serverTypeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/linktree', linktreeRoutes);
app.use('/api/rcon', rconRoutes);
app.use('/api/skin', skinRoutes);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Static files served from: ${path.join(__dirname, '..', 'uploads')}`);
});

module.exports = app;
