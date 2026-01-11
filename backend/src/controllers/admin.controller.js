const userService = require('../services/user.service');
const storeService = require('../services/store.service');
const prisma = require('../config/database');
const getDashboard = async (req, res, next) => {
    try {
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
