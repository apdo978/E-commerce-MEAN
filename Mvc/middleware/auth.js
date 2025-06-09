const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

const protect = async (req, res, next) => {
    try {
        // 1) Check if token exists
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in. Please log in to get access.'
            });
        }

        // 2) Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                status: 'fail',
                message: 'The user  no longer exists.'
            });
        }

        // 4) Grant access to protected route
        req.user = currentUser;
        next();
    } catch (error) {
        res.status(401).json({
            status: 'fail',
            message: 'Invalid User. Please log in again.'
        });
    }
};

const restrictTo = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id).populate('userType');
            
            if (!roles.includes(user.userType.name)) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'You do not have permission to perform this action'
                });
            }
            next();
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Error checking user permissions'
            });
        }
    };
};

module.exports = {
    protect,
    restrictTo
}; 