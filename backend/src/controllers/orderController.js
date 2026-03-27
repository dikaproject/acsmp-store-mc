const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const tripayService = require('../services/tripayService');
const commandService = require('../services/commandService');
const fonnteService = require('../services/fonnteService');

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

exports.getMyOrders = async (req, res, next) => {
  try {
    const minecraftName = req.user.minecraftName;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { minecraftName },
        include: {
          serverType: true,
          items: {
            include: { product: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.order.count({ where: { minecraftName } })
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

// Update create order to include email and whatsapp
exports.create = async (req, res, next) => {
  try {
    const { 
      minecraftName, 
      email,
      whatsapp,
      serverTypeId, 
      items, 
      paymentMethod,
      voucherCode
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

    // Determine upgrade pricing: if any item has isUpgrade=true for a RANK product,
    // fetch the player's current rank via RCON and resolve the current rank price
    let upgradeRankPrice = null;
    const hasUpgradeItem = items.some(i => i.isUpgrade);
    if (hasUpgradeItem) {
      try {
        const rankResult = await commandService.getPlayerRank(minecraftName, serverTypeId);
        if (rankResult.success && rankResult.rank) {
          const currentRankProduct = await prisma.product.findFirst({
            where: {
              serverTypeId,
              type: 'RANK',
              groupName: rankResult.rank,
              isActive: true
            }
          });
          if (currentRankProduct) {
            upgradeRankPrice = Math.floor(
              currentRankProduct.price - currentRankProduct.price * (currentRankProduct.discount || 0) / 100
            );
          }
        }
      } catch (e) {
        console.warn('[ORDER] Failed to fetch upgrade rank price:', e.message);
      }
    }

    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId);
      const quantity = item.quantity || 1;
      
      let finalPrice;

      if (item.isUpgrade && product.type === 'RANK' && upgradeRankPrice !== null) {
        // Upgrade pricing: pay only the discounted price difference
        const targetDiscounted = Math.floor(product.price - product.price * (product.discount || 0) / 100);
        finalPrice = Math.max(0, targetDiscounted - upgradeRankPrice);
      } else {
        // ✅ Calculate price with discount
        const originalPrice = product.price;
        const discount = product.discount || 0;
        finalPrice = Math.floor(originalPrice - (originalPrice * discount / 100));
      }
      
      return {
        productId: product.id,
        quantity,
        price: finalPrice,
        subtotal: finalPrice * quantity
      };
    });

    const totalBeforeVoucher = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Apply voucher if provided
    let voucherId = null;
    let discountAmount = 0;
    if (voucherCode) {
      const voucher = await prisma.voucher.findUnique({ where: { code: voucherCode.toUpperCase() } });
      if (
        voucher &&
        voucher.isActive &&
        voucher.usedCount < voucher.maxUse &&
        (!voucher.expiredAt || new Date() <= new Date(voucher.expiredAt))
      ) {
        discountAmount = Math.floor(totalBeforeVoucher * voucher.discount / 100);
        voucherId = voucher.id;
      }
    }

    const totalAmount = Math.max(0, totalBeforeVoucher - discountAmount);
    const orderCode = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderCode,
        minecraftName,
        email: email || null,
        whatsapp: whatsapp || null,
        totalAmount,
        discountAmount,
        serverTypeId,
        ...(voucherId ? { voucherId } : {}),
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

    // Increment voucher usedCount
    if (voucherId) {
      await prisma.voucher.update({ where: { id: voucherId }, data: { usedCount: { increment: 1 } } });
    }

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

      // 📲 Send WA notification (fire and forget)
      try {
        if (updatedOrder.whatsapp) {
          fonnteService.sendMessage(updatedOrder.whatsapp, fonnteService.buildCompletedMessage(updatedOrder));
        }
      } catch (e) {
        console.error('[FONNTE] WA notification error:', e.message);
      }
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

        // 📲 Send WA notification (fire and forget)
        try {
          const fullOrder = await prisma.order.findUnique({
            where: { id: order.id },
            include: { serverType: true, items: { include: { product: true } } }
          });
          if (fullOrder?.whatsapp) {
            fonnteService.sendMessage(fullOrder.whatsapp, fonnteService.buildPaidMessage(fullOrder));
          }
        } catch (e) {
          console.error('[WEBHOOK] WA notification error:', e.message);
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

exports.getLeaderboard = async (req, res, next) => {
  try {
    // Names excluded from leaderboard (e.g. owner accounts)
    // Set LEADERBOARD_EXCLUDED env var as comma-separated list to override
    const excluded = process.env.LEADERBOARD_EXCLUDED
      ? process.env.LEADERBOARD_EXCLUDED.split(',').map(s => s.trim()).filter(Boolean)
      : ['MasWisnu', '.MasWisnu'];

    // Top donors: group COMPLETED orders by minecraftName, sum totalAmount
    const topDonors = await prisma.order.groupBy({
      by: ['minecraftName'],
      where: {
        status: 'COMPLETED',
        NOT: { minecraftName: { in: excluded } }
      },
      _sum: { totalAmount: true },
      _count: { _all: true },
      orderBy: { _sum: { totalAmount: 'desc' } },
      take: 10
    });

    // Top products: sum quantities sold across COMPLETED orders
    const topProductsRaw = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: { order: { status: 'COMPLETED' } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10
    });

    const productIds = topProductsRaw.map(t => t.productId);
    const products = productIds.length > 0
      ? await prisma.product.findMany({ where: { id: { in: productIds } } })
      : [];
    const productMap = Object.fromEntries(products.map(p => [p.id, p]));

    res.json({
      success: true,
      data: {
        topDonors: topDonors.map((d, i) => ({
          rank: i + 1,
          minecraftName: d.minecraftName,
          totalAmount: d._sum.totalAmount || 0,
          orderCount: d._count._all
        })),
        topProducts: topProductsRaw.map((item, i) => {
          const product = productMap[item.productId];
          return {
            rank: i + 1,
            productId: item.productId,
            productName: product?.name ?? 'Unknown',
            productType: product?.type ?? 'UNKNOWN',
            imageUrl: product?.imageUrl ?? null,
            totalQuantity: item._sum.quantity || 0
          };
        })
      }
    });
  } catch (error) {
    next(error);
  }
};
