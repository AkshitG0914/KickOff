const jwt = require('jsonwebtoken');
const { ApiResponse } = require('../../utils/ApiResponse');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json(
            ApiResponse.error('Access token required')
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
