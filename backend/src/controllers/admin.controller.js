const userService = require('../services/user.service');
const storeService = require('../services/store.service');
const prisma = require('../config/database');

/**
 * Get admin dashboard statistics
 */
const getDashboard = async (req, res, next) => {
    try {
        // Get total counts
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            prisma.user.count(),
            prisma.store.count(),
            prisma.rating.count(),
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStores,
                totalRatings,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all stores with filters
 */
const getStores = async (req, res, next) => {
    try {
        const stores = await storeService.getAllStores(req.query);

        res.status(200).json({
            success: true,
            data: {
                stores,
                total: stores.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Add new store with owner
 */
const addStore = async (req, res, next) => {
    try {
        const result = await storeService.createStore(req.body);

        res.status(201).json({
            success: true,
            message: 'Store and owner created successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all users with filters
 */
const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers(req.query);

        res.status(200).json({
            success: true,
            data: {
                users,
                total: users.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Add new user (Admin or Normal User)
 */
const addUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user details by ID
 */
const getUserDetails = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);

        res.status(200).json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboard,
    getStores,
    addStore,
    getUsers,
    addUser,
    getUserDetails,
};
