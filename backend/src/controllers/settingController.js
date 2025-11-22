const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = async (req, res, next) => {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: { key: 'asc' }
    });

    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    res.json({
      success: true,
      data: settingsObject
    });
  } catch (error) {
    next(error);
  }
};

exports.getByKey = async (req, res, next) => {
  try {
    const { key } = req.params;

    const setting = await prisma.setting.findUnique({
      where: { key }
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    res.json({
      success: true,
      data: setting
    });
  } catch (error) {
    next(error);
  }
};

exports.upsert = async (req, res, next) => {
  try {
    const { key, value } = req.body;

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });

    res.json({
      success: true,
      message: 'Setting saved successfully',
      data: setting
    });
  } catch (error) {
    next(error);
  }
};

exports.bulkUpsert = async (req, res, next) => {
  try {
    const { settings } = req.body;

    const promises = Object.entries(settings).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    });

    await Promise.all(promises);

    res.json({
      success: true,
      message: 'Settings saved successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { key } = req.params;

    const existing = await prisma.setting.findUnique({
      where: { key }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    await prisma.setting.delete({
      where: { key }
    });

    res.json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
