const storeService = require('../services/store.service');
const getDashboard = async (req, res, next) => {
    try {
        if (!req.user.storeId) {
            return res.status(404).json({
                success: false,
                message: 'No store associated with this account',
            });
        }
        const dashboard = await storeService.getStoreDashboard(req.user.storeId);
        res.status(200).json({
            success: true,
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};
const getRatings = async (req, res, next) => {
    try {
        if (!req.user.storeId) {
            return res.status(404).json({
                success: false,
                message: 'No store associated with this account',
            });
        }
        const ratingService = require('../services/rating.service');
        const ratings = await ratingService.getStoreRatings(req.user.storeId);
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
    getDashboard,
    getRatings,
};
