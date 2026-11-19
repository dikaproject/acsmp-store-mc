const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Names excluded from the order-based totals (e.g. owner accounts).
// Set LEADERBOARD_EXCLUDED env var as comma-separated list to override.
// Manual entries are added on purpose by an admin, so they are never excluded.
const getExcludedNames = () =>
  process.env.LEADERBOARD_EXCLUDED
    ? process.env.LEADERBOARD_EXCLUDED.split(',').map((s) => s.trim()).filter(Boolean)
    : ['MasWisnu', '.MasWisnu'];

const PERIODS = ['all', 'year', 'month'];
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000; // Asia/Jakarta, no DST

/**
 * Calendar period in WIB: "month" = since the 1st of this month 00:00 WIB,
 * "year" = since 1 Jan 00:00 WIB, "all" = no lower bound.
 */
const getPeriodRange = (period, now = new Date()) => {
  const key = PERIODS.includes(period) ? period : 'all';
  if (key === 'all') return { key, from: null };

  const wib = new Date(now.getTime() + WIB_OFFSET_MS);
  const year = wib.getUTCFullYear();
  const month = key === 'month' ? wib.getUTCMonth() : 0;
  return { key, from: new Date(Date.UTC(year, month, 1) - WIB_OFFSET_MS) };
};

// Orders count from when they were paid (older rows without paidAt: createdAt)
const orderDateFilter = (from) =>
  from ? { OR: [{ paidAt: { gte: from } }, { paidAt: null, createdAt: { gte: from } }] } : {};

/**
 * Real COMPLETED-order totals merged with admin manual entries, within the
 * period starting at `from` (null = all time).
 * Names are matched case-insensitively; the casing from real orders wins.
 * Returns every donor sorted by total (desc), each with the breakdown.
 */
const getDonorTotals = async ({ from = null } = {}) => {
  const excluded = getExcludedNames();

  const [orderTotals, manualTotals] = await Promise.all([
    prisma.order.groupBy({
      by: ['minecraftName'],
      where: {
        status: 'COMPLETED',
        NOT: { minecraftName: { in: excluded } },
        ...orderDateFilter(from),
      },
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
    prisma.leaderboardEntry.groupBy({
      by: ['minecraftName'],
      where: from ? { donatedAt: { gte: from } } : {},
      _sum: { amount: true },
    }),
  ]);

  const donors = new Map();
  const keyOf = (name) => name.trim().toLowerCase();

  for (const row of orderTotals) {
    const key = keyOf(row.minecraftName);
    const existing = donors.get(key);
    donors.set(key, {
      minecraftName: existing?.minecraftName ?? row.minecraftName,
      orderAmount: (existing?.orderAmount ?? 0) + (row._sum.totalAmount || 0),
      manualAmount: 0,
      orderCount: (existing?.orderCount ?? 0) + row._count._all,
    });
  }

  for (const row of manualTotals) {
    const key = keyOf(row.minecraftName);
    const existing = donors.get(key);
    donors.set(key, {
      minecraftName: existing?.minecraftName ?? row.minecraftName,
      orderAmount: existing?.orderAmount ?? 0,
      manualAmount: (existing?.manualAmount ?? 0) + (row._sum.amount || 0),
      orderCount: existing?.orderCount ?? 0,
    });
  }

  return [...donors.values()]
    .map((d) => ({ ...d, totalAmount: Math.max(0, d.orderAmount + d.manualAmount) }))
    .filter((d) => d.totalAmount > 0)
    .sort((a, b) => b.totalAmount - a.totalAmount || a.minecraftName.localeCompare(b.minecraftName));
};

module.exports = { getDonorTotals, getExcludedNames, getPeriodRange, orderDateFilter };
