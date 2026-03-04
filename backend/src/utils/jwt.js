import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    algorithm: 'HS256',
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
    algorithm: 'HS256',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret, {
    algorithms: ['HS256'],
  });
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwtRefreshSecret, {
    algorithms: ['HS256'],
  });
};
