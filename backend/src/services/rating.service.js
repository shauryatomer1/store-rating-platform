const prisma = require('../config/database');
const submitRating = async (userId, storeId, ratingValue) => {
    const store = await prisma.store.findUnique({
        where: { id: storeId },
    });
    if (!store) {
        throw new Error('Store not found');
    }
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
const updateRating = async (ratingId, userId, newRatingValue) => {
    const rating = await prisma.rating.findUnique({
        where: { id: ratingId },
    });
    if (!rating) {
        throw new Error('Rating not found');
    }
    if (rating.userId !== userId) {
        throw new Error('You can only update your own ratings');
    }
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
