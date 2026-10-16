const { body, validationResult } = require('express-validator');
const { removeDigitalProductImage, uploadedImageUrl } = require('../utils/digitalProductImages');

const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
};

const fields = (optional = false) => {
  const field = (name) => optional ? body(name).optional() : body(name);
  return [
    field('title').isString().withMessage('Title must be text').bail().trim()
      .isLength({ min: 1, max: 191 }).withMessage('Title is required and must not exceed 191 characters'),
    field('description').isString().withMessage('Description must be text').bail().trim()
      .isLength({ min: 1, max: 10000 }).withMessage('Description is required and must not exceed 10000 characters'),
    field('redirectUrl').isString().withMessage('Redirect URL must be text').bail().trim()
      .isLength({ min: 1, max: 2048 }).withMessage('Redirect URL is required and must not exceed 2048 characters').bail()
      .custom(isHttpUrl).withMessage('Redirect URL must be a complete http:// or https:// URL')
  ];
};

const validate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await removeDigitalProductImage(uploadedImageUrl(req.file));
    return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  }
  next();
};

module.exports = {
  create: [...fields(), validate],
  update: [...fields(true), validate]
};
