const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

// Helper to convert string boolean to actual boolean
const toBooleanMiddleware = (fields) => {
  return (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (req.body[field] === 'true' || req.body[field] === true || req.body[field] === 1 || req.body[field] === '1') {
          req.body[field] = true;
        } else if (req.body[field] === 'false' || req.body[field] === false || req.body[field] === 0 || req.body[field] === '0') {
          req.body[field] = false;
        }
      }
    });
    next();
  };
};

const serverTypeValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').optional().trim(),
    body('isActive').optional(),
    toBooleanMiddleware(['isActive']),
    validate
  ],
  update: [
    param('id').notEmpty().withMessage('ID is required'),
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('isActive').optional(),
    toBooleanMiddleware(['isActive']),
    validate
  ]
};

const productValidation = {
  create: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('type').isIn(['COIN', 'RANK', 'FEATURE']).withMessage('Type must be COIN, RANK, or FEATURE'),
    body('price').isInt({ min: 1 }).withMessage('Price must be positive integer'),
    body('amount').isInt({ min: 1 }).withMessage('Amount must be positive integer'),
    body('serverTypeId').notEmpty().withMessage('Server type is required'),
    body('groupName').custom((value, { req }) => {
      if (req.body.type === 'RANK' && !value) {
        throw new Error('Group name is required for RANK type');
      }
      return true;
    }),
    body('permission').custom((value, { req }) => {
      if (req.body.type === 'FEATURE' && !value) {
        throw new Error('Permission is required for FEATURE type');
      }
      return true;
    }),
    body('isActive').optional(),
    toBooleanMiddleware(['isActive']),
    validate
  ],
  update: [
    param('id').notEmpty().withMessage('ID is required'),
    body('name').optional().trim().notEmpty(),
    body('type').optional().isIn(['COIN', 'RANK', 'FEATURE']),
    body('price').optional().isInt({ min: 1 }),
    body('amount').optional().isInt({ min: 1 }),
    body('serverTypeId').optional().notEmpty(),
    body('permission').optional(),
    body('isActive').optional(),
    toBooleanMiddleware(['isActive']),
    validate
  ]
};

const orderValidation = {
  create: [
    // ✅ minecraftName comes from JWT token, not from body
    body('email')
      .optional()
      .isEmail().withMessage('Invalid email format'),
    body('whatsapp')
      .trim()
      .notEmpty().withMessage('WhatsApp number is required')
      .matches(/^(\+?62|0)[0-9]{9,12}$/).withMessage('Invalid WhatsApp number format'),
    body('serverTypeId')
      .notEmpty().withMessage('Server type is required'),
    body('items')
      .isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.productId')
      .notEmpty().withMessage('Product ID is required'),
    body('items.*.quantity')
      .optional()
      .isInt({ min: 1 }),
    body('paymentMethod')
      .notEmpty().withMessage('Payment method is required'),
    validate
  ],
  updateStatus: [
    param('id').notEmpty().withMessage('ID is required'),
    body('status').isIn(['PENDING', 'PAID', 'PROCESSING', 'COMPLETED', 'FAILED', 'EXPIRED'])
      .withMessage('Invalid status'),
    validate
  ]
};

const galleryValidation = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('order').optional().isInt(),
    body('isActive').optional(),
    toBooleanMiddleware(['isActive']),
    validate
  ],
  update: [
    param('id').notEmpty().withMessage('ID is required'),
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('order').optional().isInt(),
    body('isActive').optional(),
    toBooleanMiddleware(['isActive']),
    validate
  ]
};

const guideValidation = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required')
      .matches(/^[a-z0-9-]+$/).withMessage('Slug must be lowercase alphanumeric with dashes'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('order').optional().isInt(),
    body('isActive').optional(),
    toBooleanMiddleware(['isActive']),
    validate
  ],
  update: [
    param('id').notEmpty().withMessage('ID is required'),
    body('title').optional().trim().notEmpty(),
    body('slug').optional().trim().matches(/^[a-z0-9-]+$/),
    body('content').optional().trim().notEmpty(),
    body('order').optional().isInt(),
    body('isActive').optional(),
    toBooleanMiddleware(['isActive']),
    validate
  ]
};

const settingValidation = {
  upsert: [
    body('key').trim().notEmpty().withMessage('Key is required'),
    body('value').trim().notEmpty().withMessage('Value is required'),
    validate
  ],
  bulkUpsert: [
    body('settings').isObject().withMessage('Settings must be an object'),
    validate
  ]
};

module.exports = {
  validate,
  toBooleanMiddleware,
  serverTypeValidation,
  productValidation,
  orderValidation,
  galleryValidation,
  guideValidation,
  settingValidation
};
