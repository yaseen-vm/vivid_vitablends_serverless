import { setCookie, deleteCookie } from 'hono/cookie';
import config from '../config/index.js';

export const getDeviceInfo = (c) => {
  return c.req.header('user-agent') || 'Unknown';
};

export const getIpAddress = (c) => {
  return (
    c.req.header('x-forwarded-for')?.split(',')[0] ||
    c.req.header('cf-connecting-ip') ||
    'Unknown'
  );
};

const getCookieOptions = () => ({
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  path: '/',
});

export const setRefreshTokenCookie = (c, refreshToken) => {
  setCookie(c, config.refreshTokenCookieName, refreshToken, {
    ...getCookieOptions(),
    maxAge: Math.floor(config.refreshTokenCookieMaxAge / 1000), // Hono maxAge is in seconds
  });
};

export const clearRefreshTokenCookie = (c) => {
  deleteCookie(c, config.refreshTokenCookieName, getCookieOptions());
};
