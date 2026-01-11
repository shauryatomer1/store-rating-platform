const prisma = require('../config/database');

/**
 * Submit a new rating for a store
 */
const submitRating = async (userId, storeId, ratingValue) => {
    // Check if store exists
    const store = await prisma.store.findUnique({
        where: { id: storeId },
    });

    if (!store) {
        throw new Error('Store not found');
    }

    // Check if user has already rated this store
    const existingRating = await prisma.rating.findUnique({
        where: {
            userId_storeId: {
                userId,
                storeId,
            },
        },
    });

    if (existingRating) {
        throw new Error('You have already rated this store. Use update to change your rating.');
    }

    // Create rating
    const rating = await prisma.rating.create({
        data: {
            userId,
            storeId,
            rating: ratingValue,
        },
        include: {
            store: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return rating;
};

/**
 * Update an existing rating
 */
const updateRating = async (ratingId, userId, newRatingValue) => {
    // Find rating
    const rating = await prisma.rating.findUnique({
        where: { id: ratingId },
    });

    if (!rating) {
        throw new Error('Rating not found');
    }

    // Verify ownership
    if (rating.userId !== userId) {
        throw new Error('You can only update your own ratings');
    }

    // Update rating
    const updatedRating = await prisma.rating.update({
        where: { id: ratingId },
        data: { rating: newRatingValue },
        include: {
            store: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return updatedRating;
};

/**
 * Get user's ratings
 */
const getUserRatings = async (userId) => {
    const ratings = await prisma.rating.findMany({
        where: { userId },
        include: {
            store: {
                select: {
                    id: true,
                    name: true,
                    address: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return ratings;
};

/**
 * Get store's ratings
 */
const getStoreRatings = async (storeId) => {
    const ratings = await prisma.rating.findMany({
        where: { storeId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return ratings;
};

module.exports = {
    submitRating,
    updateRating,
    getUserRatings,
    getStoreRatings,
};
