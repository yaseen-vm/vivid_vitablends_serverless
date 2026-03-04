import logger from '../utils/logger.js';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      logger.warn('Validation failed', {
        errors: error.errors,
        path: req.path,
      });
      next(
        Object.assign(new Error('Validation failed'), {
          statusCode: 400,
          code: 'VALIDATION_ERROR',
          errors: error.errors,
        })
      );
    }
  };
};
