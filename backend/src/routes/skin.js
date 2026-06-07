const express = require('express');
const router = express.Router();
const { uploadSkin, getTexture, getShortUrl } = require('../controllers/skinController');
const { publicWriteLimiter } = require('../middleware/rateLimiters');

// GET /api/skin/s/:code — resolve short code and redirect
router.get('/s/:code', getShortUrl);

// GET /api/skin/texture/:hash — redirects to Minecraft texture CDN (no storage)
router.get('/texture/:hash', getTexture);

// POST /api/skin/upload
router.post('/upload', publicWriteLimiter, uploadSkin);

module.exports = router;
