const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const {
    storeSearchValidation,
    submitRatingValidation,
    updateRatingValidation,
} = require('../utils/validators');

// All user routes require authentication and USER role
router.use(authMiddleware);
router.use(roleMiddleware(['USER']));

// Store browsing
router.get('/stores', storeSearchValidation, validationMiddleware, userController.getStores);

// Rating management
router.post('/ratings', submitRatingValidation, validationMiddleware, userController.submitRating);
router.put('/ratings/:id', updateRatingValidation, validationMiddleware, userController.updateRating);
router.get('/ratings/my', userController.getMyRatings);

module.exports = router;
