const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            req.user = await User.findById(decoded.id).select('-password');

            // Hardcoded Admin Check Securely
            if (req.user && req.user.email === 'kartikchoudhary@gmail.com') {
                req.user.role = 'admin';
            }

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        // Only allow if role matches OR it is the super admin email
        if (!roles.includes(req.user.role) && req.user.email !== 'kartikchoudhary@gmail.com') {
            return res.status(403).json({ message: 'Forbidden: Unauthorized access' });
        }
        next();
    };
};

module.exports = { protect, restrictTo };
