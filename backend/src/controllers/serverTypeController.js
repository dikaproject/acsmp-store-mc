const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    
    const where = {};
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const serverTypes = await prisma.serverType.findMany({
      where,
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: serverTypes
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const serverType = await prisma.serverType.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { price: 'asc' }
        }
      }
    });

    if (!serverType) {
      return res.status(404).json({
        success: false,
        message: 'Server type not found'
      });
    }

    res.json({
      success: true,
      data: serverType
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, description, imageUrl, isActive } = req.body;

    // Convert isActive to boolean properly
    const isActiveBoolean = isActive === true || isActive === 'true' || isActive === '1';

    const serverType = await prisma.serverType.create({
      data: {
        name,
        description,
        imageUrl: req.file ? `/uploads/servers/${req.file.filename}` : imageUrl,
        isActive: isActiveBoolean
      }
    });

    res.status(201).json({
      success: true,
      message: 'Server type created successfully',
      data: serverType
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, isActive } = req.body;

    const existing = await prisma.serverType.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Server type not found'
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    
    // Convert isActive to boolean properly
    if (isActive !== undefined) {
      updateData.isActive = isActive === true || isActive === 'true' || isActive === '1';
    }
    
    if (req.file) {
      updateData.imageUrl = `/uploads/servers/${req.file.filename}`;
    } else if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }

    const serverType = await prisma.serverType.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Server type updated successfully',
      data: serverType
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.serverType.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true, orders: true }
        }
      }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Server type not found'
      });
    }

    if (existing._count.products > 0 || existing._count.orders > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete server type with existing products or orders'
      });
    }

    await prisma.serverType.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Server type deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
