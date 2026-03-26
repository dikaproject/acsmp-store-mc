const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const MINESKIN_API_KEY = process.env.MINESKIN_API_KEY || 'msk_s1Lw5kJ5_AkzwkAIAY4TLAJtb4e1kz8GFiU1hlu_lrKQSCQ1D30ZsNonONAZiJPAUVTJPXqZ7';

// Generate or reuse a short 8-char hex code for a texture hash
async function createShortCode(hash) {
  if (!hash) return null;
  try {
    const existing = await prisma.skinShortUrl.findFirst({ where: { hash } });
    if (existing) return existing.code;
    for (let i = 0; i < 5; i++) {
      const code = crypto.randomBytes(4).toString('hex');
      try {
        await prisma.skinShortUrl.create({ data: { code, hash } });
        return code;
      } catch (e) {
        if (e.code !== 'P2002') throw e; // retry only on unique conflict
      }
    }
  } catch (e) {
    console.warn('[SkinShortUrl] Failed to create short code:', e.message);
  }
  return null;
}

// Multer — memory storage, PNG only, max 1 MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG files are allowed'));
    }
  },
});

function extractSkinUrls(skin) {
  // MineSkin v2 response shapes vary — handle gracefully
  const texture = skin?.texture || skin?.data?.texture || {};

  // texture.url may be a plain string (old) or an object { skin, cape } (new v2)
  let skinUrl = null;
  if (typeof texture?.url === 'string') {
    skinUrl = texture.url;
  } else if (texture?.url?.skin) {
    skinUrl = texture.url.skin;
  } else if (texture?.urls?.skin) {
    skinUrl = texture.urls.skin;
  } else if (typeof skin?.skinUrl === 'string') {
    skinUrl = skin.skinUrl;
  }

  const textureId = texture?.value
    ? (() => { try { const d = JSON.parse(Buffer.from(texture.value, 'base64').toString()); return d?.textures?.SKIN?.url?.split('/').pop() || null; } catch { return null; } })()
    : null;

  return { skinUrl, textureId };
}

async function waitForJob(jobId) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 3000));
    const res = await axios.get(`https://api.mineskin.org/v2/queue/${jobId}`, {
      headers: {
        Authorization: `Bearer ${MINESKIN_API_KEY}`,
        'User-Agent': 'AmazingCraft-SkinUploader/1.0',
        Accept: 'application/json',
      },
    });
    // In MineSkin v2, the job status is in res.data.job, but the skin object is at res.data.skin
    const jobStatus = res.data?.job?.status || res.data?.status;
    if (jobStatus === 'completed' || jobStatus === 'success') {
      // Prefer the top-level skin object which has full texture data
      return res.data.skin || res.data.job?.skin || res.data;
    }
    if (jobStatus === 'failed' || jobStatus === 'error') {
      throw new Error(res.data?.job?.error || res.data?.error || 'MineSkin job failed');
    }
  }
  throw new Error('MineSkin job timed out after 60 seconds');
}

const uploadSkin = [
  upload.single('skin'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No PNG file uploaded' });
      }

      const model = req.body?.model === 'slim' ? 'slim' : 'classic';

      // Build multipart form for MineSkin
      const form = new FormData();
      form.append('file', req.file.buffer, {
        filename: 'skin.png',
        contentType: 'image/png',
      });
      form.append('variant', model);

      const uploadRes = await axios.post('https://api.mineskin.org/v2/queue', form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${MINESKIN_API_KEY}`,
          'User-Agent': 'AmazingCraft-SkinUploader/1.0',
          Accept: 'application/json',
        },
        timeout: 30_000,
      });

      const body = uploadRes.data;

      // If already completed, return immediately
      if (body?.skin) {
        const urls = extractSkinUrls(body.skin);
        const hash = urls.skinUrl?.split('/texture/').pop() ?? null;
        const shortCode = await createShortCode(hash);
        return res.json({
          success: true,
          status: 'completed',
          skinId: body.skin?.uuid || body.skin?.id || null,
          skinUrl: urls.skinUrl,
          textureId: urls.textureId,
          shortCode,
          model,
        });
      }

      // Otherwise poll for job completion
      const jobId = body?.job?.id || body?.id;
      if (!jobId) {
        return res.status(502).json({ success: false, message: 'No job ID from MineSkin' });
      }

      const skin = await waitForJob(jobId);
      const urls = extractSkinUrls(skin);
      const hash = urls.skinUrl?.split('/texture/').pop() ?? null;
      const shortCode = await createShortCode(hash);

      return res.json({
        success: true,
        status: 'completed',
        skinId: skin?.uuid || skin?.id || null,
        skinUrl: urls.skinUrl,
        textureId: urls.textureId,
        shortCode,
        model,
      });
    } catch (err) {
      if (err.message === 'Only PNG files are allowed') {
        return res.status(400).json({ success: false, message: err.message });
      }
      // Multer file-size error
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large (max 1 MB)' });
      }
      // Axios error from MineSkin API — log full details and return 502
      if (err.response) {
        console.error('[MineSkin] API error:', err.response.status, JSON.stringify(err.response.data));
        return res.status(502).json({
          success: false,
          message: `MineSkin API error (${err.response.status}): ${JSON.stringify(err.response.data)}`,
        });
      }
      next(err);
    }
  },
];

// GET /api/skin/texture/:hash — proxy the texture PNG (SkinsRestorer doesn't follow redirects)
const getTexture = async (req, res) => {
  const { hash } = req.params;
  if (!/^[a-f0-9]{10,128}$/i.test(hash)) {
    return res.status(400).json({ success: false, message: 'Invalid texture hash' });
  }
  try {
    const upstream = await axios.get(
      `https://textures.minecraft.net/texture/${hash}`,
      { responseType: 'arraybuffer', timeout: 10_000 }
    );
    res.set('Content-Type', upstream.headers['content-type'] || 'image/png');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(upstream.data);
  } catch (e) {
    res.status(502).json({ success: false, message: 'Failed to fetch texture' });
  }
};

// GET /api/skin/s/:code — resolve short code and proxy texture PNG
const getShortUrl = async (req, res) => {
  const { code } = req.params;
  if (!/^[a-f0-9]{6,16}$/i.test(code)) {
    return res.status(400).json({ success: false, message: 'Invalid code' });
  }
  try {
    const entry = await prisma.skinShortUrl.findUnique({ where: { code } });
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Short URL not found' });
    }
    const upstream = await axios.get(
      `https://textures.minecraft.net/texture/${entry.hash}`,
      { responseType: 'arraybuffer', timeout: 10_000 }
    );
    res.set('Content-Type', upstream.headers['content-type'] || 'image/png');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(upstream.data);
  } catch (e) {
    res.status(502).json({ success: false, message: 'Failed to fetch texture' });
  }
};

module.exports = { uploadSkin, getTexture, getShortUrl };
