const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'fail',
            errors: errors.array()
        });
    }
    next();
};

// User validation rules
const userValidationRules = () => {
    return [
        body('name')
            .trim()
            .isLength({ min: 4 })
            .withMessage('Name must be at least 4 characters long'),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please enter a valid email'),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/\d/)
            .withMessage('Password must contain a number')
            .matches(/[A-Z]/)
            .withMessage('Password must contain an uppercase letter')
    ];
};

// Product validation rules
const productValidationRules = () => {
    return [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),
        body('description')
            .trim()
            .notEmpty()
            .withMessage('Description is required'),
        body('category')
            .trim()
            .notEmpty()
            .withMessage('Category is required'),
        body('qunt')
            .isInt({ min: 0 })
            .withMessage('Quantity must be a positive number')
    ];
};

module.exports = {
    validate,
    userValidationRules,
    productValidationRules
}; 