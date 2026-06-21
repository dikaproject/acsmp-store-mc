const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = async (req, res, next) => {
  try {
    const { isActive } = req.query;

    const where = {};
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const guides = await prisma.guide.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: guides
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const guide = await prisma.guide.findUnique({
      where: { id }
    });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    res.json({
      success: true,
      data: guide
    });
  } catch (error) {
    next(error);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const guide = await prisma.guide.findUnique({
      where: { slug }
    });

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    res.json({
      success: true,
      data: guide
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, slug, content, order, isActive } = req.body;

    const guide = await prisma.guide.create({
      data: {
        title,
        slug,
        content,
        imageUrl: req.file ? `/uploads/guides/${req.file.filename}` : null,
        order: order ? parseInt(order) : 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Guide created successfully',
      data: guide
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, content, order, isActive } = req.body;

    const existing = await prisma.guide.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (content !== undefined) updateData.content = content;
    if (order !== undefined) updateData.order = parseInt(order);
    if (isActive !== undefined) updateData.isActive = isActive;
    
    if (req.file) {
      updateData.imageUrl = `/uploads/guides/${req.file.filename}`;
    }

    const guide = await prisma.guide.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Guide updated successfully',
      data: guide
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.guide.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    await prisma.guide.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Guide deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Upload inline image from TinyMCE editor
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    const url = `/uploads/guides/${req.file.filename}`;
    res.json({ success: true, url });
  } catch (error) {
    next(error);
  }
};
