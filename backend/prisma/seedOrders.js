const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper function untuk generate random date dalam range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function untuk generate order code
function generateOrderCode(date) {
  const timestamp = date.getTime();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Helper function untuk generate random payment method
function randomPaymentMethod() {
  const methods = ['QRIS', 'BRIVA', 'BCAVA', 'MANDIRIVA', 'BNIVA', 'ALFAMART', 'INDOMARET'];
  return methods[Math.floor(Math.random() * methods.length)];
}

// Helper function untuk generate minecraft name
function randomMinecraftName() {
  const prefixes = ['Steve', 'Alex', 'Notch', 'Herobrine', 'Enderman', 'Creeper', 'Diamond', 'Netherite', 'Dragon', 'Wither'];
  const suffixes = ['Pro', 'Gaming', 'YT', 'God', 'King', 'Lord', 'Master', 'Legend', '123', '456'];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
}

// Helper function untuk generate status berdasarkan tanggal
function getStatusByDate(date) {
  const now = new Date();
  const daysDiff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 1) {
    // Recent orders - mix of statuses
    const statuses = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'PROCESSING', 'PENDING'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  } else {
    // Older orders - mostly completed
    const statuses = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'FAILED'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
}

async function seedOrders() {
  console.log('🌱 Starting order seeding...');

  // Get server types and products
  const serverTypes = await prisma.serverType.findMany();
  const products = await prisma.product.findMany();
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

  if (serverTypes.length === 0 || products.length === 0) {
    console.log('❌ Please run main seed first to create server types and products!');
    return;
  }

  // Date range: 20 September 2025 - 6 Oktober 2025
  const startDate = new Date('2026-04-26T00:00:00');
  const endDate = new Date('2026-05-26T23:59:59');
  
  // Generate 150 orders untuk distribusi yang bagus
  const numberOfOrders = 150;
  const orders = [];

  console.log(`📦 Generating ${numberOfOrders} orders from ${startDate.toDateString()} to ${endDate.toDateString()}...`);

  for (let i = 0; i < numberOfOrders; i++) {
    const orderDate = randomDate(startDate, endDate);
    const status = getStatusByDate(orderDate);
    const serverType = serverTypes[Math.floor(Math.random() * serverTypes.length)];
    
    // Filter products by server type
    const serverProducts = products.filter(p => p.serverTypeId === serverType.id);
    
    // Random 1-3 items per order
    const numItems = Math.floor(Math.random() * 3) + 1;
    const orderItems = [];
    let totalAmount = 0;

    for (let j = 0; j < numItems; j++) {
      const product = serverProducts[Math.floor(Math.random() * serverProducts.length)];
      const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity
      const subtotal = product.price * quantity;
      
      orderItems.push({
        productId: product.id,
        quantity,
        price: product.price,
        subtotal
      });
      
      totalAmount += subtotal;
    }

    const paymentMethod = randomPaymentMethod();
    const orderCode = generateOrderCode(orderDate);
    const minecraftName = randomMinecraftName();

    orders.push({
      orderCode,
      minecraftName,
      email: `${minecraftName.toLowerCase()}@player.com`,
      whatsapp: `08${Math.floor(Math.random() * 1000000000)}`,
      totalAmount,
      status,
      tripayReference: status !== 'PENDING' ? `T${Date.now()}${Math.random().toString(36).substring(7)}` : null,
      tripayMethod: status !== 'PENDING' ? paymentMethod : null,
      paymentUrl: status === 'PENDING' ? `https://tripay.co.id/checkout/${orderCode}` : null,
      qrUrl: status === 'PENDING' && paymentMethod === 'QRIS' ? `https://tripay.co.id/qr/${orderCode}` : null,
      expiredAt: status === 'PENDING' ? new Date(orderDate.getTime() + 24 * 60 * 60 * 1000) : null,
      paidAt: ['COMPLETED', 'PROCESSING', 'PAID'].includes(status) ? new Date(orderDate.getTime() + Math.random() * 3600000) : null,
      serverTypeId: serverType.id,
      userId: admin?.id,
      createdAt: orderDate,
      updatedAt: orderDate,
      items: {
        create: orderItems
      }
    });
  }

  // Bulk create orders
  console.log('💾 Inserting orders into database...');
  
  for (const order of orders) {
    try {
      await prisma.order.create({
        data: order
      });
    } catch (error) {
      console.error(`Error creating order ${order.orderCode}:`, error.message);
    }
  }

  // Statistics
  const stats = {
    total: orders.length,
    byStatus: {},
    byServerType: {},
    totalRevenue: 0
  };

  orders.forEach(order => {
    // Count by status
    stats.byStatus[order.status] = (stats.byStatus[order.status] || 0) + 1;
    
    // Count by server type
    const serverTypeName = serverTypes.find(st => st.id === order.serverTypeId)?.name;
    stats.byServerType[serverTypeName] = (stats.byServerType[serverTypeName] || 0) + 1;
    
    // Calculate revenue (only completed orders)
    if (order.status === 'COMPLETED') {
      stats.totalRevenue += order.totalAmount;
    }
  });

  console.log('\n🎉 Order seeding completed!');
  console.log('\n📊 Statistics:');
  console.log('─────────────────────────────────');
  console.log(`Total Orders: ${stats.total}`);
  console.log(`\n📈 By Status:`);
  Object.entries(stats.byStatus).forEach(([status, count]) => {
    console.log(`  ${status}: ${count} (${((count / stats.total) * 100).toFixed(1)}%)`);
  });
  console.log(`\n🎮 By Server Type:`);
  Object.entries(stats.byServerType).forEach(([serverType, count]) => {
    console.log(`  ${serverType}: ${count} (${((count / stats.total) * 100).toFixed(1)}%)`);
  });
  console.log(`\n💰 Total Revenue (Completed): Rp ${stats.totalRevenue.toLocaleString('id-ID')}`);
  console.log('─────────────────────────────────');

  // Date distribution
  console.log(`\n📅 Date Distribution:`);
  const dateGroups = {};
  orders.forEach(order => {
    const dateKey = order.createdAt.toISOString().split('T')[0];
    dateGroups[dateKey] = (dateGroups[dateKey] || 0) + 1;
  });
  
  Object.entries(dateGroups)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([date, count]) => {
      const bar = '█'.repeat(Math.ceil(count / 3));
      console.log(`  ${date}: ${bar} ${count} orders`);
    });

  console.log('\n✨ Dashboard akan menampilkan grafik yang bagus sekarang!\n');
}

async function clearOrders() {
  console.log('🗑️  Clearing existing orders...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  console.log('✅ All orders cleared!');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--clear')) {
    await clearOrders();
  }
  
  await seedOrders();
}

main()
  .catch((e) => {
    console.error('❌ Error seeding orders:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });