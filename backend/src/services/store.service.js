const prisma = require('../config/database');
const { hashPassword } = require('../utils/password.util');

/**
 * Get all stores with filters, sorting, and average ratings
 */
const getAllStores = async (filters = {}) => {
    const { search, sortBy = 'createdAt', order = 'desc', userId = null } = filters;

    // Build where clause for search
    const where = {};
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
        ];
    }

    // Get stores with ratings
    const stores = await prisma.store.findMany({
        where,
        select: {
            id: true,
            name: true,
            email: true,
            address: true,
            createdAt: true,
            ratings: {
                select: {
                    id: true,
                    rating: true,
                    userId: true,
                },
            },
        },
    });

    // Calculate average rating and user's rating for each store
    const storesWithRatings = stores.map(store => {
        const totalRatings = store.ratings.length;
        const sumRatings = store.ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

        // Find user's rating if userId is provided
        let userRating = null;
        let userRatingId = null;
        if (userId) {
            const userRatingObj = store.ratings.find(r => r.userId === userId);
            if (userRatingObj) {
                userRating = userRatingObj.rating;
                userRatingId = userRatingObj.id;
            }
        }

        return {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            totalRatings,
            userRating,
            userRatingId,
            createdAt: store.createdAt,
        };
    });

    // Sort stores
    if (sortBy === 'rating') {
        storesWithRatings.sort((a, b) => {
            return order === 'asc'
                ? a.averageRating - b.averageRating
                : b.averageRating - a.averageRating;
        });
    } else if (sortBy === 'name') {
        storesWithRatings.sort((a, b) => {
            return order === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });
    } else {
        // Default sort by createdAt
        storesWithRatings.sort((a, b) => {
            return order === 'asc'
                ? new Date(a.createdAt) - new Date(b.createdAt)
                : new Date(b.createdAt) - new Date(a.createdAt);
        });
    }

    return storesWithRatings;
};

/**
 * Get store by ID with details
 */
const getStoreById = async (storeId) => {
    const store = await prisma.store.findUnique({
        where: { id: storeId },
        include: {
            ratings: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    if (!store) {
        throw new Error('Store not found');
    }

    // Calculate average rating
    const totalRatings = store.ratings.length;
    const sumRatings = store.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    return {
        ...store,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
    };
};

/**
 * Create a new store with owner
 */
const createStore = async (storeData) => {
    const {
        name,
        email,
        address,
        ownerName,
        ownerEmail,
        ownerPassword,
        ownerAddress
    } = storeData;

    // Hash owner password
    const hashedPassword = await hashPassword(ownerPassword);

    // Create store and owner in a transaction
    const result = await prisma.$transaction(async (tx) => {
        // Create store
        const store = await tx.store.create({
            data: {
                name,
                email,
                address,
            },
        });

        // Create store owner user
        const owner = await tx.user.create({
            data: {
                name: ownerName,
                email: ownerEmail,
                password: hashedPassword,
                address: ownerAddress,
                role: 'STORE_OWNER',
                storeId: store.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
            },
        });

        return { store, owner };
    });

    return result;
};

/**
 * Get store dashboard data for store owner
 */
const getStoreDashboard = async (storeId) => {
    const store = await prisma.store.findUnique({
        where: { id: storeId },
        include: {
            ratings: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            address: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    if (!store) {
        throw new Error('Store not found');
    }

    // Calculate statistics
    const totalRatings = store.ratings.length;
    const sumRatings = store.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Count ratings by value
    const ratingDistribution = {
        1: store.ratings.filter(r => r.rating === 1).length,
        2: store.ratings.filter(r => r.rating === 2).length,
        3: store.ratings.filter(r => r.rating === 3).length,
        4: store.ratings.filter(r => r.rating === 4).length,
        5: store.ratings.filter(r => r.rating === 5).length,
    };

    return {
        store: {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
        },
        statistics: {
            averageRating: Math.round(averageRating * 10) / 10,
            totalRatings,
            ratingDistribution,
        },
        recentRatings: store.ratings.slice(0, 10), // Return only 10 most recent
        allRatings: store.ratings,
    };
};

module.exports = {
    getAllStores,
    getStoreById,
    createStore,
    getStoreDashboard,
};
