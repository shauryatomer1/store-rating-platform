const { body, param, query } = require('express-validator');

/**
 * Validation rules for user signup
 */
const signupValidation = [
    body('name')
        .trim()
        .isLength({ min: 20, max: 60 })
        .withMessage('Name must be between 20 and 60 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character'),

    body('address')
        .trim()
        .isLength({ max: 400 })
        .withMessage('Address must not exceed 400 characters')
        .notEmpty()
        .withMessage('Address is required'),
];

/**
 * Validation rules for login
 */
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

/**
 * Validation rules for password update
 */
const updatePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),

    body('newPassword')
        .isLength({ min: 8, max: 16 })
        .withMessage('New password must be between 8 and 16 characters')
        .matches(/[A-Z]/)
        .withMessage('New password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('New password must contain at least one special character'),
];

/**
 * Validation rules for adding a store
 */
const addStoreValidation = [
    body('name')
        .trim()
        .isLength({ min: 20, max: 60 })
        .withMessage('Store name must be between 20 and 60 characters'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('address')
        .trim()
        .isLength({ max: 400 })
        .withMessage('Address must not exceed 400 characters')
        .notEmpty()
        .withMessage('Address is required'),

    body('ownerName')
        .trim()
        .isLength({ min: 20, max: 60 })
        .withMessage('Owner name must be between 20 and 60 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Owner name can only contain letters and spaces'),

    body('ownerEmail')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid owner email address')
        .normalizeEmail(),

    body('ownerPassword')
        .isLength({ min: 8, max: 16 })
        .withMessage('Owner password must be between 8 and 16 characters')
        .matches(/[A-Z]/)
        .withMessage('Owner password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Owner password must contain at least one special character'),

    body('ownerAddress')
        .trim()
        .isLength({ max: 400 })
        .withMessage('Owner address must not exceed 400 characters')
        .notEmpty()
        .withMessage('Owner address is required'),
];

/**
 * Validation rules for adding a user
 */
const addUserValidation = [
    body('name')
        .trim()
        .isLength({ min: 20, max: 60 })
        .withMessage('Name must be between 20 and 60 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character'),

    body('address')
        .trim()
        .isLength({ max: 400 })
        .withMessage('Address must not exceed 400 characters')
        .notEmpty()
        .withMessage('Address is required'),

    body('role')
        .optional()
        .isIn(['USER'])
        .withMessage('Role must be USER'),
];

/**
 * Validation rules for submitting a rating
 */
const submitRatingValidation = [
    body('storeId')
        .notEmpty()
        .withMessage('Store ID is required')
        .isUUID()
        .withMessage('Invalid store ID format'),

    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5'),
];

/**
 * Validation rules for updating a rating
 */
const updateRatingValidation = [
    param('id')
        .notEmpty()
        .withMessage('Rating ID is required')
        .isUUID()
        .withMessage('Invalid rating ID format'),

    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5'),
];

/**
 * Validation rules for store search/filter
 */
const storeSearchValidation = [
    query('search')
        .optional()
        .trim(),

    query('sortBy')
        .optional()
        .isIn(['name', 'rating', 'createdAt'])
        .withMessage('Sort by must be one of: name, rating, createdAt'),

    query('order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Order must be either asc or desc'),
];

/**
 * Validation rules for user list filter
 */
const userListValidation = [
    query('name')
        .optional()
        .trim(),

    query('email')
        .optional()
        .trim(),

    query('address')
        .optional()
        .trim(),

    query('role')
        .optional()
        .isIn(['ADMIN', 'USER', 'STORE_OWNER'])
        .withMessage('Role must be one of: ADMIN, USER, STORE_OWNER'),

    query('sortBy')
        .optional()
        .isIn(['name', 'email', 'role', 'createdAt'])
        .withMessage('Sort by must be one of: name, email, role, createdAt'),

    query('order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Order must be either asc or desc'),
];

module.exports = {
    signupValidation,
    loginValidation,
    updatePasswordValidation,
    addStoreValidation,
    addUserValidation,
    submitRatingValidation,
    updateRatingValidation,
    storeSearchValidation,
    userListValidation,
};
