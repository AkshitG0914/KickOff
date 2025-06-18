const jwt = require('jsonwebtoken');

class TokenUtils {
    static generateAccessToken(user) {
        return jwt.sign(
            { sub: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
    }

    static generateRefreshToken(user) {
        return jwt.sign(
            { sub: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
    }

    static setRefreshTokenCookie(res, token) {
        res.cookie('refreshToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }

    static clearRefreshTokenCookie(res) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}

module.exports = TokenUtils;
