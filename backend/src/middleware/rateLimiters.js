// src/middleware/rateLimiters.js
// Centralized rate limiters to protect against brute-force and spam abuse.
const rateLimit = require('express-rate-limit');

const jsonHandler = (message) => (req, res /*, next, options */) => {
  res.status(429).json({
    success: false,
    message
  });
};

// Strict limiter for authentication endpoints (admin + player login).
// Protects against credential brute-force from a single IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                  // max 10 login attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only count failed attempts toward the limit
  handler: jsonHandler('Terlalu banyak percobaan login. Coba lagi dalam 15 menit.')
});

// Limiter for order/transaction creation.
// Prevents a single IP from spamming the payment gateway with orders.
const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 8,                   // max 8 order creations per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler('Terlalu banyak transaksi dalam waktu singkat. Mohon tunggu beberapa menit.')
});

// Limiter for payment-status polling (public endpoint that can trigger RCON/Tripay calls).
const paymentStatusLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler('Terlalu banyak permintaan. Mohon tunggu sebentar.')
});

// Limiter for other sensitive public POST endpoints (voucher validation, skin upload).
const publicWriteLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler('Terlalu banyak permintaan. Mohon tunggu sebentar.')
});

// Generous global limiter as a baseline safety net for the whole API.
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300,                // 300 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler('Terlalu banyak permintaan. Mohon tunggu sebentar.')
});

module.exports = {
  loginLimiter,
  orderLimiter,
  paymentStatusLimiter,
  publicWriteLimiter,
  globalLimiter
};
