const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const {
    addStoreValidation,
    addUserValidation,
    userListValidation,
    storeSearchValidation,
} = require('../utils/validators');

// All admin routes require authentication and ADMIN role
router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN']));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Store management
router.get('/stores', storeSearchValidation, validationMiddleware, adminController.getStores);
router.post('/stores', addStoreValidation, validationMiddleware, adminController.addStore);

// User management
router.get('/users', userListValidation, validationMiddleware, adminController.getUsers);
router.post('/users', addUserValidation, validationMiddleware, adminController.addUser);
router.get('/users/:id', adminController.getUserDetails);

module.exports = router;
