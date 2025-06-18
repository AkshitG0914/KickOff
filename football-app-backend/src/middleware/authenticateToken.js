const jwt = require('jsonwebtoken');
const { ApiResponse } = require('../utils/ApiResponse');
const TokenBlacklistService = require('../services/TokenBlacklistService');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json(
            ApiResponse.error('Access token required')
        );
    }

    // Check if token is blacklisted
    if (await TokenBlacklistService.isBlacklisted(token)) {
        return res.status(401).json(
            ApiResponse.error('Token is invalid')
        );
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json(
            ApiResponse.error(err.name === 'TokenExpiredError' 
                ? 'Token has expired' 
                : 'Invalid token'
            )
        );
    }
};

module.exports = authenticateToken;
