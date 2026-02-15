const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

// Public - get active links only
exports.getAll = async (req, res, next) => {
  try {
    const links = await prisma.linktreeLink.findMany({
      where: { isActive: true },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: links
    });
  } catch (error) {
    next(error);
  }
};

// Admin - get all links including inactive
exports.getAllAdmin = async (req, res, next) => {
  try {
    const links = await prisma.linktreeLink.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: links
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const link = await prisma.linktreeLink.findUnique({
      where: { id }
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    res.json({
      success: true,
      data: link
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, url, icon, description, backgroundColor, order, isActive } = req.body;

    const link = await prisma.linktreeLink.create({
      data: {
        title,
        url,
        icon: icon || null,
        description: description || null,
        backgroundColor: backgroundColor || null,
        order: order ? parseInt(order) : 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Link created successfully',
      data: link
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, url, icon, description, backgroundColor, order, isActive } = req.body;

    const existing = await prisma.linktreeLink.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (url !== undefined) updateData.url = url;
    if (icon !== undefined) updateData.icon = icon;
    if (description !== undefined) updateData.description = description;
    if (backgroundColor !== undefined) updateData.backgroundColor = backgroundColor;
    if (order !== undefined) updateData.order = parseInt(order);
    if (isActive !== undefined) updateData.isActive = isActive;

    const link = await prisma.linktreeLink.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Link updated successfully',
      data: link
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.linktreeLink.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    await prisma.linktreeLink.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Link deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.reorder = async (req, res, next) => {
  try {
    const { links } = req.body;

    if (!Array.isArray(links)) {
      return res.status(400).json({
        success: false,
        message: 'Links must be an array of { id, order }'
      });
    }

    await Promise.all(
      links.map(({ id, order }) =>
        prisma.linktreeLink.update({
          where: { id },
          data: { order: parseInt(order) }
        })
      )
    );

    res.json({
      success: true,
      message: 'Links reordered successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Upload background image
exports.uploadBackground = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    // Delete old background image if exists
    const existingSetting = await prisma.setting.findUnique({
      where: { key: 'linktreeBgImage' }
    });

    if (existingSetting && existingSetting.value) {
      const oldPath = path.join(process.cwd(), existingSetting.value);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const imageUrl = `/uploads/linktree/${req.file.filename}`;

    await prisma.setting.upsert({
      where: { key: 'linktreeBgImage' },
      update: { value: imageUrl },
      create: { key: 'linktreeBgImage', value: imageUrl }
    });

    res.json({
      success: true,
      message: 'Background image uploaded successfully',
      data: { imageUrl }
    });
  } catch (error) {
    next(error);
  }
};

// Delete background image
exports.deleteBackground = async (req, res, next) => {
  try {
    const existingSetting = await prisma.setting.findUnique({
      where: { key: 'linktreeBgImage' }
    });

    if (existingSetting && existingSetting.value) {
      const oldPath = path.join(process.cwd(), existingSetting.value);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await prisma.setting.upsert({
      where: { key: 'linktreeBgImage' },
      update: { value: '' },
      create: { key: 'linktreeBgImage', value: '' }
    });

    res.json({
      success: true,
      message: 'Background image removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
