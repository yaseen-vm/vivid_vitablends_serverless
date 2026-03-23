import { SignJWT, jwtVerify } from 'jose';
import { getHonoContext } from './context.js';

const getEnvVar = (key, defaultValue) => {
  const c = getHonoContext();
  if (c && c.env && c.env[key]) {
    return c.env[key];
  }
  // Fallback for non-worker environments or tests
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }

  if (defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }

  return defaultValue;
};

const getSecret = () => new TextEncoder().encode(getEnvVar('JWT_SECRET'));
const getRefreshSecret = () =>
  new TextEncoder().encode(getEnvVar('JWT_REFRESH_SECRET'));

export const generateToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(getEnvVar('JWT_EXPIRES_IN', '15m'))
    .sign(getSecret());
};

export const generateRefreshToken = async (payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'))
    .sign(getRefreshSecret());
};

export const verifyToken = async (token) => {
  const { payload } = await jwtVerify(token, getSecret(), {
    algorithms: ['HS256'],
  });
  return payload;
};

export const verifyRefreshToken = async (token) => {
  const { payload } = await jwtVerify(token, getRefreshSecret(), {
    algorithms: ['HS256'],
  });
  return payload;
};
