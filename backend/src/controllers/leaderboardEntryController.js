const { PrismaClient } = require('@prisma/client');
const { getDonorTotals, getPeriodRange } = require('../services/leaderboardService');
const prisma = new PrismaClient();

// Java names (3-16 word chars) plus Bedrock/Geyser prefixes ("." or "_") and spaces
const NAME_REGEX = /^[A-Za-z0-9_. ]{2,32}$/;
const MAX_AMOUNT = 1_000_000_000;

const parsePayload = (body) => {
  const minecraftName = typeof body.minecraftName === 'string' ? body.minecraftName.trim() : '';
  const amount = Number(body.amount);
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 200) : '';
  const donatedAt = body.donatedAt ? new Date(body.donatedAt) : new Date();

  if (!NAME_REGEX.test(minecraftName)) {
    return { error: 'Gamertag tidak valid (2-32 karakter: huruf, angka, _ . atau spasi)' };
  }
  if (!Number.isInteger(amount) || amount === 0 || Math.abs(amount) > MAX_AMOUNT) {
    return { error: 'Nominal harus bilangan bulat, tidak boleh 0, maksimal Rp 1.000.000.000' };
  }
  // Allow back-dating (old manual donations), but not into the future
  if (Number.isNaN(donatedAt.getTime()) || donatedAt.getTime() > Date.now() + 60 * 1000) {
    return { error: 'Tanggal donasi tidak valid atau di masa depan' };
  }
  return { data: { minecraftName, amount, note: note || null, donatedAt } };
};

/** Admin: manual entries + the merged ranking for ?period= (so the admin sees the real effect) */
exports.getAll = async (req, res, next) => {
  try {
    const period = getPeriodRange(req.query.period);
    const [entries, donors] = await Promise.all([
      prisma.leaderboardEntry.findMany({ orderBy: [{ donatedAt: 'desc' }, { createdAt: 'desc' }] }),
      getDonorTotals({ from: period.from }),
    ]);

    res.json({
      success: true,
      data: {
        entries,
        period: { key: period.key, from: period.from },
        ranking: donors.slice(0, 20).map((d, i) => ({ rank: i + 1, ...d })),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { data, error } = parsePayload(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    const entry = await prisma.leaderboardEntry.create({ data });
    res.status(201).json({ success: true, message: 'Donasi manual ditambahkan', data: entry });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { data, error } = parsePayload(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    const existing = await prisma.leaderboardEntry.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Entri tidak ditemukan' });

    const entry = await prisma.leaderboardEntry.update({ where: { id: req.params.id }, data });
    res.json({ success: true, message: 'Donasi manual diperbarui', data: entry });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const existing = await prisma.leaderboardEntry.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ success: false, message: 'Entri tidak ditemukan' });

    await prisma.leaderboardEntry.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Donasi manual dihapus' });
  } catch (error) {
    next(error);
  }
};
