const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const tripayService = require('../services/tripayService');
const commandService = require('../services/commandService');

exports.getAll = async (req, res, next) => {
  try {
    const { status, serverTypeId, page = 1, limit = 20 } = req.query;

    const where = {};
    if (status) where.status = status;
    if (serverTypeId) where.serverTypeId = serverTypeId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          serverType: true,
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        serverType: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

exports.getByOrderCode = async (req, res, next) => {
  try {
    const { orderCode } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: {
        serverType: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Update create order to include email and whatsapp
exports.create = async (req, res, next) => {
  try {
    const { 
      minecraftName, 
      email,
      whatsapp,
      serverTypeId, 
      items, 
      paymentMethod 
    } = req.body;

    if (!minecraftName || minecraftName !== req.user.minecraftName) {
      return res.status(400).json({
        success: false,
        message: 'Invalid minecraft name'
      });
    }

    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true
      }
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some products are not available'
      });
    }

    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      const quantity = item.quantity || 1;
      
      // ✅ Calculate price with discount
      const originalPrice = product.price;
      const discount = product.discount || 0;
      const finalPrice = Math.floor(originalPrice - (originalPrice * discount / 100));
      
      return {
        productId: product.id,
        quantity,
        price: finalPrice, // ✅ Use discounted price
        subtotal: finalPrice * quantity
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    const orderCode = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderCode,
        minecraftName,
        email: email || null,
        whatsapp: whatsapp || null,
        totalAmount,
        serverTypeId,
        status: 'PENDING',
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        serverType: true
      }
    });

    let paymentData = null;
    try {
      paymentData = await tripayService.createPayment({
        orderId: order.id,
        orderCode: order.orderCode,
        amount: order.totalAmount,
        customerName: order.minecraftName,
        customerEmail: order.email,
        customerPhone: order.whatsapp,
        paymentMethod
      });

      await prisma.order.update({
        where: { id: order.id },
        data: {
          tripayReference: paymentData.reference,
          tripayMethod: paymentData.payment_method,
          paymentUrl: paymentData.checkout_url,
          qrUrl: paymentData.qr_url,
          expiredAt: new Date(paymentData.expired_time * 1000)
        }
      });
    } catch (error) {
      console.error('Tripay error:', error);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        ...order,
        payment: paymentData
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.checkPaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!order.tripayReference) {
      return res.status(400).json({
        success: false,
        message: 'No payment reference found'
      });
    }

    const paymentStatus = await tripayService.checkPaymentStatus(order.tripayReference);

    if (paymentStatus.status === 'PAID' && order.status === 'PENDING') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paidAt: new Date()
        }
      });

      await commandService.executeOrderCommands(order.id);
    }

    res.json({
      success: true,
      data: paymentStatus
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const updateData = { status };
    if (status === 'COMPLETED' && !order.paidAt) {
      updateData.paidAt = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        serverType: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (status === 'COMPLETED') {
      await commandService.executeOrderCommands(order.id);
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

exports.handleWebhook = async (req, res, next) => {
  try {
    const callbackSignature = req.headers['x-callback-signature'];
    const json = JSON.stringify(req.body);

    console.log('[WEBHOOK] Received callback:', {
      signature: callbackSignature,
      reference: req.body.reference,
      status: req.body.status
    });

    // ✅ Validate signature with raw JSON string
    const isValid = tripayService.validateCallbackSignature(callbackSignature, json);

    if (!isValid) {
      console.error('[WEBHOOK] Invalid signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    const { reference, status, merchant_ref, total_amount } = req.body;

    const order = await prisma.order.findUnique({
      where: { orderCode: merchant_ref }
    });

    if (!order) {
      console.error('[WEBHOOK] Order not found:', merchant_ref);
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('[WEBHOOK] Processing order:', {
      orderCode: order.orderCode,
      currentStatus: order.status,
      newStatus: status
    });

    // ✅ Handle different payment statuses
    if (status === 'PAID') {
      if (order.status !== 'PAID' && order.status !== 'COMPLETED') {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            tripayReference: reference
          }
        });

        console.log('[WEBHOOK] Order marked as PAID, executing commands...');

        // ✅ Execute RCON commands
        try {
          await commandService.executeOrderCommands(order.id);
          console.log('[WEBHOOK] Commands executed successfully');
        } catch (error) {
          console.error('[WEBHOOK] Command execution failed:', error);
          // Don't fail the webhook, just log the error
        }
      }
    } else if (status === 'EXPIRED') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'EXPIRED' }
      });
      console.log('[WEBHOOK] Order expired');
    } else if (status === 'FAILED') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' }
      });
      console.log('[WEBHOOK] Order failed');
    }

    // ✅ Always return success to Tripay
    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('[WEBHOOK] Error:', error);
    // ✅ Still return success to avoid Tripay retry
    res.json({
      success: true,
      message: 'Webhook received'
    });
  }
};

exports.getPaymentChannels = async (req, res, next) => {
  try {
    const channels = await tripayService.getPaymentChannels();
    
    // Filter only active channels
    const activeChannels = channels.filter(channel => channel.active);
    
    res.json({
      success: true,
      data: activeChannels
    });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const { period = '30' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Total Orders
    const totalOrders = await prisma.order.count();
    
    // Total Revenue
    const totalRevenue = await prisma.order.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { totalAmount: true }
    });

    // Orders by Status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    // Recent Orders (last 30 days)
    const recentOrders = await prisma.order.count({
      where: {
        createdAt: { gte: daysAgo }
      }
    });

    // Revenue Trend (last 30 days)
    const revenueTrend = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        SUM(totalAmount) as revenue,
        COUNT(id) as orders
      FROM orders
      WHERE createdAt >= ${daysAgo}
        AND status = 'COMPLETED'
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `;

    // Top Products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { subtotal: 'desc' } },
      take: 5
    });

    const productsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { serverType: true }
        });
        return {
          ...product,
          totalSold: item._sum.quantity,
          totalRevenue: item._sum.subtotal
        };
      })
    );

    // Server Type Sales
    const serverTypeSales = await prisma.order.groupBy({
      by: ['serverTypeId'],
      where: { status: 'COMPLETED' },
      _sum: { totalAmount: true },
      _count: { id: true }
    });

    const serverSalesWithDetails = await Promise.all(
      serverTypeSales.map(async (sale) => {
        const serverType = await prisma.serverType.findUnique({
          where: { id: sale.serverTypeId }
        });
        return {
          name: serverType.name,
          revenue: sale._sum.totalAmount,
          orders: sale._count.id
        };
      })
    );

    res.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          totalRevenue: totalRevenue._sum.totalAmount || 0,
          recentOrders,
          ordersByStatus: ordersByStatus.reduce((acc, curr) => {
            acc[curr.status] = curr._count.id;
            return acc;
          }, {})
        },
        revenueTrend: revenueTrend.map(item => ({
          date: item.date.toISOString().split('T')[0],
          revenue: Number(item.revenue),
          orders: Number(item.orders)
        })),
        topProducts: productsWithDetails,
        serverTypeSales: serverSalesWithDetails
      }
    });
  } catch (error) {
    next(error);
  }
};
