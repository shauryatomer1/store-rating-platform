const storeService = require('../services/store.service');
const ratingService = require('../services/rating.service');

/**
 * Get all stores for normal users
 */
const getStores = async (req, res, next) => {
    try {
        // Pass user ID to get their ratings as well
        const filters = {
            ...req.query,
            userId: req.user.id,
        };

        const stores = await storeService.getAllStores(filters);

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
 * Submit a rating for a store
 */
const submitRating = async (req, res, next) => {
    try {
        const { storeId, rating } = req.body;
        const result = await ratingService.submitRating(
            req.user.id,
            storeId,
            rating
        );

        res.status(201).json({
            success: true,
            message: 'Rating submitted successfully',
            data: { rating: result },
        });
    } catch (error) {
        // Handle already rated error with 409 status
        if (error.message.includes('already rated')) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};

/**
 * Update an existing rating
 */
const updateRating = async (req, res, next) => {
    try {
        const { rating } = req.body;
        const result = await ratingService.updateRating(
            req.params.id,
            req.user.id,
            rating
        );

        res.status(200).json({
            success: true,
            message: 'Rating updated successfully',
            data: { rating: result },
        });
    } catch (error) {
        // Handle ownership error with 403 status
        if (error.message.includes('your own')) {
            return res.status(403).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};

/**
 * Get user's own ratings
 */
const getMyRatings = async (req, res, next) => {
    try {
        const ratings = await ratingService.getUserRatings(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                ratings,
                total: ratings.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStores,
    submitRating,
    updateRating,
    getMyRatings,
};
