const storeService = require('../services/store.service');
const ratingService = require('../services/rating.service');
const getStores = async (req, res, next) => {
    try {
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
        if (error.message.includes('already rated')) {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};
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
        if (error.message.includes('your own')) {
            return res.status(403).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};
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
