const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/** Validate a voucher code and return discount info (public) */
exports.validate = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Kode voucher diperlukan' });

    const voucher = await prisma.voucher.findUnique({ where: { code: code.toUpperCase() } });

    if (!voucher || !voucher.isActive) {
      return res.status(404).json({ success: false, message: 'Voucher tidak valid atau sudah tidak aktif' });
    }

    if (voucher.expiredAt && new Date() > new Date(voucher.expiredAt)) {
      return res.status(400).json({ success: false, message: 'Voucher sudah kedaluwarsa' });
    }

    if (voucher.usedCount >= voucher.maxUse) {
      return res.status(400).json({ success: false, message: 'Voucher sudah mencapai batas penggunaan' });
    }

    res.json({
      success: true,
      data: {
        id: voucher.id,
        code: voucher.code,
        discount: voucher.discount,
      }
    });
  } catch (error) {
    next(error);
  }
};

/** Admin: list all vouchers */
exports.getAll = async (req, res, next) => {
  try {
    const vouchers = await prisma.voucher.findMany({
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: vouchers });
  } catch (error) {
    next(error);
  }
};

/** Admin: create voucher */
exports.create = async (req, res, next) => {
  try {
    const { code, discount, maxUse, isActive, expiredAt } = req.body;

    if (!code || !discount) {
      return res.status(400).json({ success: false, message: 'Kode dan diskon wajib diisi' });
    }

    const discountNum = parseInt(discount);
    if (discountNum < 1 || discountNum > 100) {
      return res.status(400).json({ success: false, message: 'Diskon harus antara 1 dan 100' });
    }

    const voucher = await prisma.voucher.create({
      data: {
        code: code.trim().toUpperCase(),
        discount: discountNum,
        maxUse: parseInt(maxUse) || 1,
        isActive: isActive !== false && isActive !== 'false',
        expiredAt: expiredAt ? new Date(expiredAt) : null
      }
    });

    res.status(201).json({ success: true, message: 'Voucher berhasil dibuat', data: voucher });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Kode voucher sudah digunakan' });
    }
    next(error);
  }
};

/** Admin: update voucher */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discount, maxUse, isActive, expiredAt } = req.body;

    const updateData = {};
    if (code !== undefined) updateData.code = code.trim().toUpperCase();
    if (discount !== undefined) updateData.discount = parseInt(discount);
    if (maxUse !== undefined) updateData.maxUse = parseInt(maxUse);
    if (isActive !== undefined) updateData.isActive = isActive === true || isActive === 'true';
    if (expiredAt !== undefined) updateData.expiredAt = expiredAt ? new Date(expiredAt) : null;

    const voucher = await prisma.voucher.update({
      where: { id },
      data: updateData
    });

    res.json({ success: true, message: 'Voucher berhasil diupdate', data: voucher });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Voucher tidak ditemukan' });
    }
    next(error);
  }
};

/** Admin: delete voucher */
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.voucher.delete({ where: { id } });
    res.json({ success: true, message: 'Voucher berhasil dihapus' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Voucher tidak ditemukan' });
    }
    next(error);
  }
};
