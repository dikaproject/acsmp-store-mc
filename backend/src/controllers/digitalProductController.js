const prisma = require('../config/database');
const { removeDigitalProductImage, uploadedImageUrl } = require('../utils/digitalProductImages');

const createDigitalProductController = (database = prisma) => ({
  getAll: async (req, res, next) => {
    try {
      const products = await database.digitalProduct.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'desc' }] });
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const product = await database.digitalProduct.findUnique({ where: { id: req.params.id } });
      if (!product) return res.status(404).json({ success: false, message: 'Digital product not found' });
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });

      const { title, description, redirectUrl } = req.body;
      const product = await database.digitalProduct.create({
        data: { title, description, redirectUrl, imageUrl: uploadedImageUrl(req.file) }
      });
      res.status(201).json({ success: true, message: 'Digital product created successfully', data: product });
    } catch (error) {
      await removeDigitalProductImage(uploadedImageUrl(req.file));
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const existing = await database.digitalProduct.findUnique({ where: { id: req.params.id } });
      if (!existing) {
        await removeDigitalProductImage(uploadedImageUrl(req.file));
        return res.status(404).json({ success: false, message: 'Digital product not found' });
      }

      const data = {};
      for (const field of ['title', 'description', 'redirectUrl']) {
        if (req.body[field] !== undefined) data[field] = req.body[field];
      }
      if (req.file) data.imageUrl = uploadedImageUrl(req.file);

      const product = await database.digitalProduct.update({ where: { id: req.params.id }, data });
      if (req.file && existing.imageUrl !== product.imageUrl) await removeDigitalProductImage(existing.imageUrl);
      res.json({ success: true, message: 'Digital product updated successfully', data: product });
    } catch (error) {
      await removeDigitalProductImage(uploadedImageUrl(req.file));
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const existing = await database.digitalProduct.findUnique({ where: { id: req.params.id } });
      if (!existing) return res.status(404).json({ success: false, message: 'Digital product not found' });

      await database.digitalProduct.delete({ where: { id: req.params.id } });
      await removeDigitalProductImage(existing.imageUrl);
      res.json({ success: true, message: 'Digital product deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
});

module.exports = { ...createDigitalProductController(), createDigitalProductController };
