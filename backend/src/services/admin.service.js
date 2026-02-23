import logger from '../utils/logger.js';
import { comparePassword } from '../utils/password.js';
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { hashToken } from '../utils/hash.js';
import config from '../config/index.js';

export const createAdminService = ({ adminRepository, sessionRepository }) => ({
  login: async (username, password, deviceInfo, ipAddress) => {
    logger.info('Login attempt', { username });

    if (!username || !password) {
      throw Object.assign(new Error('Username and password are required'), {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      });
    }

    const admin = await adminRepository.findByUsername(username);

    if (!admin) {
      logger.warn('User not found', { username });
      throw Object.assign(new Error('Invalid credentials'), {
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
      });
    }

    const isPasswordValid = await comparePassword(password, admin.password);

    if (!isPasswordValid) {
      logger.warn('Invalid password', { username });
      throw Object.assign(new Error('Invalid credentials'), {
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
      });
    }

    const payload = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
    };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const refreshTokenHash = hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await sessionRepository.createSession({
      adminId: admin.id,
      refreshTokenHash,
      expiresAt,
      deviceInfo,
      ipAddress,
    });

    logger.info('Login success', { username, userId: admin.id });

    return {
      token,
      refreshToken,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
      expiresIn: config.jwtExpiresIn,
    };
  },

  refresh: async (refreshToken, deviceInfo, ipAddress) => {
    logger.info('Token refresh attempt');

    if (!refreshToken) {
      throw Object.assign(new Error('Refresh token is required'), {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const refreshTokenHash = hashToken(refreshToken);

    const session = await sessionRepository.findByTokenHash(refreshTokenHash);

    if (!session || session.revoked || session.expiresAt < new Date()) {
      logger.warn('Invalid or expired refresh token');
      throw Object.assign(new Error('Invalid refresh token'), {
        statusCode: 401,
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    if (session.adminId !== decoded.id) {
      logger.warn('Token mismatch');
      throw Object.assign(new Error('Invalid refresh token'), {
        statusCode: 401,
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    // Delete old session (token rotation)
    await sessionRepository.deleteSession(refreshTokenHash);

    const payload = {
      id: session.admin.id,
      username: session.admin.username,
      role: session.admin.role,
    };

    const token = generateToken(payload);
    const newRefreshToken = generateRefreshToken(payload);
    const newRefreshTokenHash = hashToken(newRefreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await sessionRepository.createSession({
      adminId: session.admin.id,
      refreshTokenHash: newRefreshTokenHash,
      expiresAt,
      deviceInfo,
      ipAddress,
    });

    logger.info('Token refresh success', { userId: session.admin.id });

    return {
      token,
      refreshToken: newRefreshToken,
      expiresIn: config.jwtExpiresIn,
    };
  },

  logout: async (refreshToken) => {
    logger.info('Logout attempt');

    if (refreshToken) {
      const refreshTokenHash = hashToken(refreshToken);
      await sessionRepository.deleteSession(refreshTokenHash).catch((err) => {
        logger.debug('Session already deleted or not found', {
          error: err.message,
        });
      });
    }

    logger.info('Logout success');
    return { message: 'Logged out successfully' };
  },

  cleanupExpiredSessions: async () => {
    await sessionRepository.deleteExpiredSessions();
    logger.info('Expired sessions cleaned up');
  },
});
