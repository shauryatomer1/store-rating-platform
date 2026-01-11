const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const {
    signupValidation,
    loginValidation,
    updatePasswordValidation,
} = require('../utils/validators');

// Public routes
router.post('/signup', signupValidation, validationMiddleware, authController.signup);
router.post('/login', loginValidation, validationMiddleware, authController.login);

// Protected routes
router.put(
    '/password',
    authMiddleware,
    updatePasswordValidation,
    validationMiddleware,
    authController.updatePassword
);

module.exports = router;
