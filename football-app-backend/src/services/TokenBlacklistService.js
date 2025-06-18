const redis = require('../config/redis');

class TokenBlacklistService {
  static async add(token, ttlSeconds = 900) {
    if (!token) return;
    const key = `blacklist:${token}`;
    await redis.set(key, true, 'EX', ttlSeconds);
  }

  static async isBlacklisted(token) {
    if (!token) return false;
    const result = await redis.get(`blacklist:${token}`);
    return !!result;
  }
}

module.exports = TokenBlacklistService;
