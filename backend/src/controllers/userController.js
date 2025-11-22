const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
    try {
        const { email, name, role, password, } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const exitingUser = await prisma.user.findUnique({ where: { email } });
        if (exitingUser) {
            return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
        }
        const user = await prisma.user.create({
            data: { email, name, role, password: hashedPassword, },
            select: { id: true, email: true, name: true, role: true,  }
        })
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, name, role, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { id } });

        const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;

        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }
        const user = await prisma.user.update({
            where: { id },
            data: { email, name, role, password: hashedPassword },
            select: { id: true, email: true, name: true, role: true,  }
        });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: 'Terjadi kesalahan saat mengupdate user',
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true, role: true }
        });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data user',
            error: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data user',
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id }
        });
        res.json({ success: true, message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat menghapus user',
            error: error.message
        });
    }
};

module.exports = {
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    deleteUser
};