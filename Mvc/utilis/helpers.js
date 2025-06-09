const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Format response
const formatResponse = (status, message, data = null) => {
    return {
        status,
        message,
        ...(data && { data })
    };
};

// Pagination helper
const paginateResults = (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return { skip, limit };
};

// Error handler
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    generateToken,
    hashPassword,
    comparePassword,
    formatResponse,
    paginateResults,
    AppError
}; 