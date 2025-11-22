const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = async (req, res, next) => {
  try {
    const { serverTypeId, type, category, isActive } = req.query;

    const where = {};
    if (serverTypeId) where.serverTypeId = serverTypeId;
    
    // Support both 'type' and 'category' query params
    if (type) {
      where.type = type.toUpperCase();
    } else if (category && category !== 'all') {
      // Map category to ProductType enum
      const categoryMap = {
        'coins': 'COIN',
        'ranks': 'RANK',
        'battlepass': 'BATTLEPASS'
      };
      where.type = categoryMap[category] || category.toUpperCase();
    }
    
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const products = await prisma.product.findMany({
      where,
      include: {
        serverType: true
      },
      orderBy: [
        { type: 'asc' },
        { price: 'asc' }
      ]
    });

    // Transform data for frontend
    const transformedProducts = products.map(product => ({
      ...product,
      ServerType: product.serverType,
      category: product.type.toLowerCase()
    }));

    res.json({
      success: true,
      data: transformedProducts
    });
  } catch (error) {
    console.error('Error in getAll products:', error);
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        serverType: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...product,
        ServerType: product.serverType,
        category: product.type.toLowerCase()
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { 
      name, description, type, price, amount, groupName, 
      serverTypeId, imageUrl, isActive,
      benefits, commands 
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        type,
        price: parseInt(price),
        amount: parseInt(amount),
        groupName: type === 'RANK' ? groupName : null,
        serverTypeId,
        imageUrl: req.file ? `/uploads/products/${req.file.filename}` : imageUrl,
        isActive: isActive !== undefined ? isActive : true,
        benefits: benefits ? JSON.parse(benefits) : null,
        commands: commands ? JSON.parse(commands) : null
      },
      include: {
        serverType: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        ...product,
        ServerType: product.serverType,
        category: product.type.toLowerCase()
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      name, description, type, price, amount, groupName, 
      serverTypeId, imageUrl, isActive,
      benefits, commands 
    } = req.body;

    const existing = await prisma.product.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (price !== undefined) updateData.price = parseInt(price);
    if (amount !== undefined) updateData.amount = parseInt(amount);
    if (groupName !== undefined) updateData.groupName = groupName;
    if (serverTypeId !== undefined) updateData.serverTypeId = serverTypeId;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    if (benefits !== undefined) {
      updateData.benefits = typeof benefits === 'string' ? JSON.parse(benefits) : benefits;
    }
    if (commands !== undefined) {
      updateData.commands = typeof commands === 'string' ? JSON.parse(commands) : commands;
    }
    
    if (req.file) {
      updateData.imageUrl = `/uploads/products/${req.file.filename}`;
    } else if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        serverType: true
      }
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: {
        ...product,
        ServerType: product.serverType,
        category: product.type.toLowerCase()
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orderItems: true }
        }
      }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (existing._count.orderItems > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete product with existing orders'
      });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};