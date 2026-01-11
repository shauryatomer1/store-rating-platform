const prisma = require('../config/database');
const { hashPassword } = require('../utils/password.util');
const getAllUsers = async (filters = {}) => {
    const { name, email, address, role, sortBy = 'createdAt', order = 'desc' } = filters;
    const where = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (address) where.address = { contains: address, mode: 'insensitive' };
    if (role) where.role = role;
    const users = await prisma.user.findMany({
        where,
        select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
            createdAt: true,
            store: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            [sortBy]: order,
        },
    });
    for (const user of users) {
        if (user.store) {
            const avgRating = await prisma.rating.aggregate({
                where: { storeId: user.store.id },
                _avg: {
                    rating: true,
                },
            });
            user.store.averageRating = avgRating._avg.rating || 0;
        }
    }
    return users;
};
const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
            createdAt: true,
            store: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    address: true,
                    _count: {
                        select: {
                            ratings: true,
                        },
                    },
                },
            },
            ratings: {
                select: {
                    id: true,
                    rating: true,
                    store: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    createdAt: true,
                },
            },
        },
    });
    if (!user) {
        throw new Error('User not found');
    }
    if (user.store) {
        const avgRating = await prisma.rating.aggregate({
            where: { storeId: user.store.id },
            _avg: {
                rating: true,
            },
        });
        user.store.averageRating = avgRating._avg.rating || 0;
    }
    return user;
};
const createUser = async (userData) => {
    const { name, email, password, address, role } = userData;
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            address,
            role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
            createdAt: true,
        },
    });
    return user;
};
module.exports = {
    getAllUsers,
    getUserById,
    createUser,
};
