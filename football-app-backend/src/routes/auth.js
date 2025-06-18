const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const validateRequest = require('../middleware/validation/validateRequest');
const { registerSchema, loginSchema, refreshTokenSchema } = require('../validators/auth');
const rateLimit = require('express-rate-limit');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeRoles = require('../middleware/authorizeRoles');

// Configure rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // limit each IP to 5 requests per windowMs
});

// Authentication Routes
/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', 
    authLimiter,
    validateRequest(registerSchema), 
    AuthController.register
);

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post('/login',
    authLimiter,
    validateRequest(loginSchema),
    AuthController.login
);

/**
 * @route POST /api/auth/refresh-token
 * @desc Refresh access token using refresh token
 * @access Public
 */
router.post('/refresh-token',
    validateRequest(refreshTokenSchema),
    AuthController.refreshToken
);

/**
 * @route POST /api/auth/logout
 * @desc Logout user and invalidate token
 * @access Private
 */
router.post('/logout', authenticateToken, AuthController.logout);

/**
 * @route GET /api/auth/admin/users
 * @desc Get all users (admin only)
 * @access Private/Admin
 */
router.get('/admin/users',
    authenticateToken,
    authorizeRoles('admin'),
    AuthController.getAllUsers
);

/**
 * @route GET /api/auth/premium/content
 * @desc Get premium content
 * @access Private/Premium
 */
router.get('/premium/content',
    authenticateToken,
    authorizeRoles('admin', 'premium'),
    AuthController.getPremiumContent
);

module.exports = router;
