import config from '../config/index.js';

export const getDeviceInfo = (req) => {
  return req.headers['user-agent'] || 'Unknown';
};

export const getIpAddress = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'Unknown';
};

export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(config.refreshTokenCookieName, refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: config.refreshTokenCookieMaxAge,
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie(config.refreshTokenCookieName);
};
