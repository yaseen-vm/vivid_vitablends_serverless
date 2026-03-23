import { verifyToken } from '../utils/jwt.js';
import logger from '../utils/logger.js';

export const authenticate = async (c, next) => {
  try {
    const authHeader = c.req.header('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return c.json(
        {
          success: false,
          message: 'Authentication required',
          code: 'AUTH_REQUIRED',
        },
        401
      );
    }

    const decoded = await verifyToken(token);
    c.set('user', decoded);
    await next();
  } catch (error) {
    logger.warn('Authentication failed', { error: error.message });
    return c.json(
      {
        success: false,
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      },
      401
    );
  }
};
