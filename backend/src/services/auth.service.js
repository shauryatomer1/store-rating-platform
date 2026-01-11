const prisma = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/password.util');
const { generateToken } = require('../utils/jwt.util');

/**
 * User signup service
 */
const signup = async (userData) => {
    const { name, email, password, address } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
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

    // Generate token
    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });

    return { user, token };
};

/**
 * User login service
 */
const login = async (credentials) => {
    const { email, password } = credentials;

    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            store: true, // Include store info for store owners
        },
    });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
        throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
};

/**
 * Update user password service
 */
const updatePassword = async (userId, currentPassword, newPassword) => {
    // Find user
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, user.password);

    if (!isValidPassword) {
        throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
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
