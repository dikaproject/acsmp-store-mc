const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

exports.getAll = async (req, res, next) => {
  try {
    const { serverTypeId, type, category, isActive } = req.query;

    const where = {};
    if (serverTypeId) where.serverTypeId = serverTypeId;
    
    if (type) {
      where.type = type.toUpperCase();
    } else if (category && category !== 'all') {
      const categoryMap = {
        'coin': 'COIN',
        'coins': 'COIN',
        'money': 'MONEY',
        'rank': 'RANK',
        'ranks': 'RANK',
        'feature': 'FEATURE',
        'features': 'FEATURE',
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
      name, description, type, price, discount, amount, groupName, permission,
      serverTypeId, isActive, isOutOfStock, benefits, commands, infoCommands
    } = req.body;

    // Parse isActive properly
    const activeStatus = isActive === 'true' || isActive === true;
    const outOfStockStatus = isOutOfStock === 'true' || isOutOfStock === true;

    // Parse benefits, commands and infoCommands
    let parsedBenefits = null;
    let parsedCommands = null;
    let parsedInfoCommands = null;

    if (benefits) {
      try {
        parsedBenefits = typeof benefits === 'string' ? JSON.parse(benefits) : benefits;
      } catch (e) {
        parsedBenefits = [];
      }
    }

    if (commands) {
      try {
        parsedCommands = typeof commands === 'string' ? JSON.parse(commands) : commands;
      } catch (e) {
        parsedCommands = [];
      }
    }

    if (infoCommands) {
      try {
        parsedInfoCommands = typeof infoCommands === 'string' ? JSON.parse(infoCommands) : infoCommands;
      } catch (e) {
        parsedInfoCommands = [];
      }
    }

    // Build image URL
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/api/uploads/products/${req.file.filename}`;
    }

    const createData = {
      name,
      description: description || null,
      type: type || 'COIN',
      price: parseInt(price) || 0,
      discount: parseInt(discount) || 0,
      amount: parseInt(amount) || 0,
      groupName: type === 'RANK' ? (groupName || null) : null,
      permission: type === 'FEATURE' ? (permission || null) : null,
      serverTypeId,
      imageUrl,
      isActive: activeStatus,
      isOutOfStock: outOfStockStatus,
      benefits: parsedBenefits,
      commands: parsedCommands
    };

    // Only include infoCommands if provided (column may not exist if db push pending)
    if (parsedInfoCommands !== null) {
      createData.infoCommands = parsedInfoCommands;
    }

    const product = await prisma.product.create({
      data: createData,
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
    // Delete uploaded file if error occurs
    if (req.file) {
      const filePath = path.join('uploads/products', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      name, description, type, price, discount, amount, groupName, permission,
      serverTypeId, isActive, isOutOfStock, benefits, commands, infoCommands
    } = req.body;

    const existing = await prisma.product.findUnique({
      where: { id }
    });

    if (!existing) {
      // Delete uploaded file if product not found
      if (req.file) {
        const filePath = path.join('uploads/products', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updateData = {};
    const nextType = type || existing.type;
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (type !== undefined) {
      updateData.type = type;
      if (nextType !== 'RANK') updateData.groupName = null;
      if (nextType !== 'FEATURE') updateData.permission = null;
    }
    if (price !== undefined) updateData.price = parseInt(price) || 0;
    if (discount !== undefined) updateData.discount = parseInt(discount) || 0;
    if (amount !== undefined) updateData.amount = parseInt(amount) || 0;
    if (groupName !== undefined && nextType === 'RANK') updateData.groupName = groupName || null;
    if (permission !== undefined && nextType === 'FEATURE') updateData.permission = permission || null;
    if (serverTypeId !== undefined) updateData.serverTypeId = serverTypeId;
    
    if (isActive !== undefined) {
      updateData.isActive = isActive === 'true' || isActive === true;
    }
    if (isOutOfStock !== undefined) {
      updateData.isOutOfStock = isOutOfStock === 'true' || isOutOfStock === true;
    }
    
    // Parse benefits
    if (benefits !== undefined) {
      try {
        updateData.benefits = typeof benefits === 'string' ? JSON.parse(benefits) : benefits;
      } catch (e) {
        updateData.benefits = [];
      }
    }
    
    // Parse commands
    if (commands !== undefined) {
      try {
        updateData.commands = typeof commands === 'string' ? JSON.parse(commands) : commands;
      } catch (e) {
        updateData.commands = [];
      }
    }

    // Parse infoCommands (only include if column exists — guard against missing db push)
    if (infoCommands !== undefined) {
      try {
        const parsed = typeof infoCommands === 'string' ? JSON.parse(infoCommands) : infoCommands;
        // Wrap in try so a missing column doesn't prevent the rest from saving
        updateData.infoCommands = parsed;
      } catch (e) {
        // ignore
      }
    }
    
    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (existing.imageUrl) {
        const oldImagePath = path.join('.', existing.imageUrl.replace('/api', ''));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.imageUrl = `/api/uploads/products/${req.file.filename}`;
    }

    let product;
    try {
      product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: { serverType: true }
      });
    } catch (dbErr) {
      // If the error is about unknown column (info_commands not yet pushed), retry without it
      if (dbErr.message && dbErr.message.includes('info_commands')) {
        delete updateData.infoCommands;
        product = await prisma.product.update({
          where: { id },
          data: updateData,
          include: { serverType: true }
        });
      } else {
        throw dbErr;
      }
    }

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
    // Delete uploaded file if error occurs
    if (req.file) {
      const filePath = path.join('uploads/products', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
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

    // Delete image file if exists
    if (existing.imageUrl) {
      const imagePath = path.join('.', existing.imageUrl.replace('/api', ''));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
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

exports.bulkUpdateStatus = async (req, res, next) => {
  try {
    const { ids, isActive, isOutOfStock } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs are required'
      });
    }

    const data = {};
    if (isActive !== undefined) {
      data.isActive = isActive === true || isActive === 'true';
    }
    if (isOutOfStock !== undefined) {
      data.isOutOfStock = isOutOfStock === true || isOutOfStock === 'true';
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (isActive or isOutOfStock) is required'
      });
    }

    const result = await prisma.product.updateMany({
      where: { id: { in: ids } },
      data
    });

    res.json({
      success: true,
      message: `${result.count} product(s) updated successfully`,
      data: { count: result.count }
    });
  } catch (error) {
    next(error);
  }
};