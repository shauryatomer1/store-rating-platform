const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateToken } = require('../utils/jwt.util');
const signup = async (userData) => {
    const { name, email, password, address } = userData;
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            address,
            role: 'USER',
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
    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });
    return { user, token };
};
const login = async (credentials) => {
    const { email, password } = credentials;
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            store: true, 
        },
    });
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
        throw new Error('Invalid email or password');
    }
    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
    });
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
const updatePassword = async (userId, currentPassword, newPassword) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new Error('User not found');
    }
    const isValidPassword = await comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
        throw new Error('Current password is incorrect');
    }
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
    return { message: 'Password updated successfully' };
};
module.exports = {
    signup,
    login,
    updatePassword,
};
