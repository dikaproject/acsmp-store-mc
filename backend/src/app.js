// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const validateEnv = require('./config/validateEnv');
// Validate security-critical env vars before anything else starts.
validateEnv();

const errorHandler = require('./middleware/errorHandler');
const { globalLimiter } = require('./middleware/rateLimiters');

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
const voucherRoutes = require('./routes/voucher');

const app = express();
const port = process.env.PORT || 5001;

// Trust the first proxy hop so express-rate-limit & req.ip read the real client IP
// (required when running behind Nginx / a load balancer).
app.set('trust proxy', 1);

// Security headers. crossOriginResourcePolicy relaxed so static uploads/images
// can be loaded by the frontend on a different origin.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS allowlist. Configure allowed origins via CORS_ORIGINS (comma-separated).
// Falls back to FRONTEND_URL, then localhost dev origins.
const allowedOrigins = (process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000'])
  .map(o => (o || '').trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow same-origin/non-browser requests (no Origin header) e.g. curl, server-to-server, webhooks.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Limit request body size to mitigate large-payload DoS.
app.use(express.json({ limit: '1mb' }));

// Baseline global rate limit across the whole API.
app.use(globalLimiter);

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
app.use('/api/vouchers', voucherRoutes);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Static files served from: ${path.join(__dirname, '..', 'uploads')}`);
});

module.exports = app;
