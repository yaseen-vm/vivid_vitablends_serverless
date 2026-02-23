import { createAdminService } from '../services/admin.service.js';
import * as adminRepository from '../repositories/admin.repository.js';
import * as sessionRepository from '../repositories/session.repository.js';
import config from '../config/index.js';
import {
  getDeviceInfo,
  getIpAddress,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../utils/request.js';

const adminService = createAdminService({ adminRepository, sessionRepository });

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const deviceInfo = getDeviceInfo(req);
    const ipAddress = getIpAddress(req);

    const result = await adminService.login(
      username,
      password,
      deviceInfo,
      ipAddress
    );

    setRefreshTokenCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: result.token,
        user: result.user,
        expiresIn: result.expiresIn,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies[config.refreshTokenCookieName] || req.body.refreshToken;
    const deviceInfo = getDeviceInfo(req);
    const ipAddress = getIpAddress(req);

    const result = await adminService.refresh(
      refreshToken,
      deviceInfo,
      ipAddress
    );

    setRefreshTokenCookie(res, result.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: result.token,
        expiresIn: result.expiresIn,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies[config.refreshTokenCookieName];
    const result = await adminService.logout(refreshToken);

    clearRefreshTokenCookie(res);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
