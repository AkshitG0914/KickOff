const TokenBlacklistService = require('../services/TokenBlacklistService');
const AuthService = require('../services/AuthService');
const { ApiResponse } = require('../utils/ApiResponse');

const register = async (req, res) => {
    try {
        const result = await AuthService.register(req.body);
        return res.status(201).json(
            ApiResponse.success(result, 'User registered successfully')
        );
    } catch (error) {
        return res.status(400).json(
            ApiResponse.error(error.message)
        );
    }
};

const login = async (req, res) => {
    try {
        const result = await AuthService.login(req.body);
        return res.status(200).json(
            ApiResponse.success(result, 'Login successful')
        );
    } catch (error) {
        return res.status(401).json(
            ApiResponse.error(error.message)
        );
    }
};

const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            await TokenBlacklistService.add(token);
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json(ApiResponse.success(null, 'Logged out successfully'));
    } catch (error) {
        res.status(500).json(ApiResponse.error(error.message));
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json(ApiResponse.error('Refresh token is required'));
        }

        const tokens = await AuthService.refreshToken(refreshToken);
        res.status(200).json(ApiResponse.success(tokens, 'Token refreshed successfully'));
    } catch (error) {
        res.status(401).json(ApiResponse.error(error.message));
    }
};

module.exports = {
    register,
    login,
    logout,
    refreshToken
};
