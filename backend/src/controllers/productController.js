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
      name, description, type, price, discount, amount, groupName, 
      serverTypeId, isActive, benefits, commands 
    } = req.body;

    // Parse isActive properly
    const activeStatus = isActive === 'true' || isActive === true;

    // Parse benefits and commands
    let parsedBenefits = null;
    let parsedCommands = null;

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

    // Build image URL
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/api/uploads/products/${req.file.filename}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        type: type || 'COIN',
        price: parseInt(price) || 0,
        discount: parseInt(discount) || 0,
        amount: parseInt(amount) || 0,
        groupName: type === 'RANK' ? (groupName || null) : null,
        serverTypeId,
        imageUrl,
        isActive: activeStatus,
        benefits: parsedBenefits,
        commands: parsedCommands
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
      name, description, type, price, discount, amount, groupName, 
      serverTypeId, isActive, benefits, commands 
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
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || null;
    if (type !== undefined) updateData.type = type;
    if (price !== undefined) updateData.price = parseInt(price) || 0;
    if (discount !== undefined) updateData.discount = parseInt(discount) || 0;
    if (amount !== undefined) updateData.amount = parseInt(amount) || 0;
    if (groupName !== undefined) updateData.groupName = groupName || null;
    if (serverTypeId !== undefined) updateData.serverTypeId = serverTypeId;
    
    if (isActive !== undefined) {
      updateData.isActive = isActive === 'true' || isActive === true;
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