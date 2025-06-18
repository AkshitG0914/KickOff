const { ApiResponse } = require('../utils/ApiResponse');

/**
 * Middleware to check if user has required role(s)
 * @param {...String} allowedRoles - Roles that have access
 * @returns {Function} Express middleware
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if user exists and has a role
        if (!req.user || !req.user.role) {
            return res.status(403).json(
                ApiResponse.error('Access denied: No role specified')
            );
        }

        // Validate role format
        if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
            return res.status(500).json(
                ApiResponse.error('Server configuration error: No roles specified')
            );
        }

        // Check if user's role is allowed
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json(
                ApiResponse.error('Access denied: Insufficient permissions')
            );
        }

        next();
    };
};

module.exports = authorizeRoles;
