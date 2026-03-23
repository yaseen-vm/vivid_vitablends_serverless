import logger from '../utils/logger.js';

export const requireAdmin = async (c, next) => {
  const user = c.get('user');
  if (!user) {
    return c.json(
      {
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED',
      },
      401
    );
  }

  if (user.role !== 'admin') {
    logger.warn('Unauthorized admin access attempt', { userId: user.id });
    return c.json(
      {
        success: false,
        message: 'Admin access required',
        code: 'ADMIN_REQUIRED',
      },
      403
    );
  }

  await next();
};
