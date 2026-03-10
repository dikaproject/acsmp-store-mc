const { PrismaClient } = require('@prisma/client');
const { Rcon } = require('rcon-client');
const { encrypt, decrypt } = require('../utils/encryption');

const prisma = new PrismaClient();

// Safely strip sensitive fields before returning to client
function sanitizeConfig(config) {
  if (!config) return null;
  const { passwordEncrypted, ...safe } = config;
  return {
    ...safe,
    hasPassword: !!passwordEncrypted
  };
}

exports.getAll = async (req, res, next) => {
  try {
    const configs = await prisma.rconConfig.findMany({
      include: {
        serverType: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json({
      success: true,
      data: configs.map(sanitizeConfig)
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const config = await prisma.rconConfig.findUnique({
      where: { id },
      include: {
        serverType: { select: { id: true, name: true } }
      }
    });

    if (!config) {
      return res.status(404).json({ success: false, message: 'RCON config not found' });
    }

    res.json({ success: true, data: sanitizeConfig(config) });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, serverTypeId, host, port, password, timeout, isActive } = req.body;

    if (!name || !serverTypeId || !host || !port || !password) {
      return res.status(400).json({
        success: false,
        message: 'name, serverTypeId, host, port, and password are required'
      });
    }

    // Verify serverType exists
    const serverType = await prisma.serverType.findUnique({ where: { id: serverTypeId } });
    if (!serverType) {
      return res.status(404).json({ success: false, message: 'ServerType not found' });
    }

    // Ensure only one config per serverType
    const existing = await prisma.rconConfig.findUnique({ where: { serverTypeId } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'RCON config for this ServerType already exists. Use update instead.'
      });
    }

    const passwordEncrypted = encrypt(password);

    const config = await prisma.rconConfig.create({
      data: {
        name,
        serverTypeId,
        host,
        port: parseInt(port),
        passwordEncrypted,
        timeout: timeout ? parseInt(timeout) : 10000,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        serverType: { select: { id: true, name: true } }
      }
    });

    res.status(201).json({ success: true, message: 'RCON config created', data: sanitizeConfig(config) });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, host, port, password, timeout, isActive } = req.body;

    const existing = await prisma.rconConfig.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'RCON config not found' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (host !== undefined) updateData.host = host;
    if (port !== undefined) updateData.port = parseInt(port);
    if (timeout !== undefined) updateData.timeout = parseInt(timeout);
    if (isActive !== undefined) updateData.isActive = isActive;

    // Only re-encrypt if a new password is provided
    if (password && password.trim() !== '') {
      updateData.passwordEncrypted = encrypt(password);
    }

    const config = await prisma.rconConfig.update({
      where: { id },
      data: updateData,
      include: {
        serverType: { select: { id: true, name: true } }
      }
    });

    res.json({ success: true, message: 'RCON config updated', data: sanitizeConfig(config) });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.rconConfig.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'RCON config not found' });
    }

    await prisma.rconConfig.delete({ where: { id } });

    res.json({ success: true, message: 'RCON config deleted' });
  } catch (error) {
    next(error);
  }
};

exports.testConnection = async (req, res, next) => {
  try {
    const { id } = req.params;

    const config = await prisma.rconConfig.findUnique({ where: { id } });
    if (!config) {
      return res.status(404).json({ success: false, message: 'RCON config not found' });
    }

    if (!config.isActive) {
      return res.status(400).json({ success: false, message: 'RCON config is disabled' });
    }

    let password;
    try {
      password = decrypt(config.passwordEncrypted);
    } catch {
      return res.status(500).json({ success: false, message: 'Failed to decrypt RCON password' });
    }

    let rcon;
    try {
      rcon = await Rcon.connect({
        host: config.host,
        port: config.port,
        password,
        timeout: config.timeout
      });

      const response = await rcon.send('list');
      await rcon.end();

      return res.json({
        success: true,
        message: `Connected to ${config.host}:${config.port} successfully`,
        output: response
      });
    } catch (connErr) {
      if (rcon) {
        try { await rcon.end(); } catch (_) {}
      }
      return res.json({
        success: false,
        message: `Connection failed: ${connErr.message}`
      });
    }
  } catch (error) {
    next(error);
  }
};
