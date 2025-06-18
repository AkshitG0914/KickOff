const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

class AuthService {
  static async register(userData) {
    const { name, email, password, role } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      accountStatus: {
        isVerified: false,
        isActive: true
      }
    });

    const tokens = this.generateTokenPair(newUser);
    return {
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.accountStatus.isVerified
      },
      tokens
    };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.accountStatus.isActive) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const tokens = this.generateTokenPair(user);
    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.accountStatus.isVerified
      },
      tokens
    };
  }

  static generateTokenPair(user) {
    const payload = {
      sub: user._id,
      role: user.accountStatus.role
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

    return {
      accessToken,
      refreshToken
    };
  }

  static async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const user = await User.findById(decoded.sub);

      if (!user || !user.accountStatus.isActive) {
        throw new Error('Invalid token');
      }

      return this.generateTokenPair(user);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async logout(token) {
    try {
      if (!token) {
        return; // Silent return if no token provided
      }

      // Here you could add token to a blacklist in Redis/DB
      // await TokenBlacklist.add(token);
      
      // Or invalidate refresh tokens in DB
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.sub) {
        await User.findByIdAndUpdate(decoded.sub, {
          $unset: { refreshToken: 1 }
        });
      }
    } catch (error) {
      // Token verification failed, but we can ignore as we're logging out anyway
      console.error('Token invalidation failed:', error);
    }
  }
}

module.exports = AuthService;
