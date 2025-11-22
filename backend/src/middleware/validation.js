const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('email').isEmail().withMessage('Email invalid'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 char'),
  body('name').notEmpty().withMessage('Name required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(e => e.msg);
      return res.status(400).json({ message: messages });
    }
    next();
  }
];

const validateUmkm = [
  body('nama').notEmpty().withMessage('Nama Usaha required'),
  body('pemilik').notEmpty().withMessage('Nama Pemilik required'),
  body('deskripsi').notEmpty().withMessage('Deskripsi required'),
  body('kategori').notEmpty().withMessage('Kategori required'),
  body('alamat').notEmpty().withMessage('Alamat required'),
  body('isAktif').optional().toBoolean().isBoolean().withMessage('isAktif harus boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(e => e.msg);
      return res.status(400).json({ message: messages });
    }
    next();
  }
];

const validateWisata = [
  body('nama').notEmpty().withMessage('Nama Wisata required'),
  body('deskripsi').notEmpty().withMessage('Deskripsi required'),
  body('lokasi').notEmpty().withMessage('Lokasi required'),
  body('isAktif').optional().toBoolean().isBoolean().withMessage('isAktif harus boolean'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(e => e.msg);
      return res.status(400).json({ message: messages });
    }
    next();
  }
];

const validateProgramPembangunan = [
  body('nama').notEmpty().withMessage('Nama Program Pembangunan required'),
  body('deskripsi').notEmpty().withMessage('Deskripsi required'),
  body('kategori').notEmpty().withMessage('Kategori required'),
  body('status').notEmpty().withMessage('Status required'),
  body('progress').notEmpty().withMessage('Progres required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(e => e.msg);
      return res.status(400).json({ message: messages });
    }
    next();
  }
];

const validateLaporan = [
  body('judul').notEmpty().withMessage('Judul Laporan required'),
  body('deskripsi').notEmpty().withMessage('Deskripsi Laporan required'),
  body('kategori').notEmpty().withMessage('Kategori required'),
  body('lokasi').notEmpty().withMessage('Lokasi required'),
  body('foto').notEmpty().withMessage('Foto required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map(e => e.msg);
      return res.status(400).json({ message: messages });
    }
    next();
  }
];


module.exports = { validateRegister, validateUmkm, validateWisata, validateProgramPembangunan, validateLaporan };
