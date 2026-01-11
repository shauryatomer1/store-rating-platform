const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// All store routes require authentication and STORE_OWNER role
router.use(authMiddleware);
router.use(roleMiddleware(['STORE_OWNER']));

// Store owner dashboard
router.get('/dashboard', storeController.getDashboard);
router.get('/ratings', storeController.getRatings);

module.exports = router;
