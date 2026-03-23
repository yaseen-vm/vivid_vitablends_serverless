import { createAdminService } from '../services/admin.service.js';
import * as adminRepository from '../repositories/admin.repository.js';
import * as sessionRepository from '../repositories/session.repository.js';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { hashToken } from '../utils/hash.js';
import {
  getDeviceInfo,
  getIpAddress,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/request.js';

const adminService = createAdminService({ adminRepository, sessionRepository });

export const login = async (c) => {
  try {
    const { username, password } = await c.req.json();
    const deviceInfo = getDeviceInfo(c);
    const ipAddress = getIpAddress(c);

    const result = await adminService.login(
      username,
      password,
      deviceInfo,
      ipAddress
    );

    setRefreshTokenCookie(c, result.refreshToken);

    return c.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          token: result.token,
          user: result.user,
          expiresIn: result.expiresIn,
        },
      },
      200
    );
  } catch (error) {
    throw error;
  }
};

export const refresh = async (c) => {
  try {
    const refreshToken =
      getCookie(c, config.refreshTokenCookieName) ||
      (await c.req.json().catch(() => ({}))).refreshToken;

    if (!refreshToken) {
      logger.warn('Token refresh failed - no refresh token provided', {
        hasCookie: !!getCookie(c, config.refreshTokenCookieName),
        hasBody: !!(await c.req.json().catch(() => ({}))).refreshToken,
      });
    }

    const deviceInfo = getDeviceInfo(c);
    const ipAddress = getIpAddress(c);

    const result = await adminService.refresh(
      refreshToken,
      deviceInfo,
      ipAddress
    );

    setRefreshTokenCookie(c, result.refreshToken);

    return c.json(
      {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          token: result.token,
          expiresIn: result.expiresIn,
        },
      },
      200
    );
  } catch (error) {
    throw error;
  }
};

export const logout = async (c) => {
  try {
    const refreshToken = getCookie(c, config.refreshTokenCookieName);

    if (refreshToken) {
      const refreshTokenHash = await hashToken(refreshToken);
      const session = await sessionRepository.findByTokenHash(refreshTokenHash);

      if (session && session.adminId !== c.get('user').id) {
        logger.warn('Token ownership mismatch during logout', {
          userId: c.get('user').id,
          sessionAdminId: session.adminId,
        });
        throw Object.assign(new Error('Invalid session'), {
          statusCode: 403,
          code: 'INVALID_SESSION',
        });
      }
    }

    const result = await adminService.logout(refreshToken);

    clearRefreshTokenCookie(c);

    return c.json(
      {
        success: true,
        message: result.message,
      },
      200
    );
  } catch (error) {
    throw error;
  }
};
