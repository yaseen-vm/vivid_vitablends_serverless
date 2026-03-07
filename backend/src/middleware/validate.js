import logger from '../utils/logger.js';
import { z } from 'zod';

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

export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      logger.warn('Query validation failed', {
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

export const validateParam = (paramName, schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.params[paramName]);
      next();
    } catch (error) {
      logger.warn('Param validation failed', {
        errors: error.errors,
        path: req.path,
      });
      next(
        Object.assign(new Error('Invalid parameter'), {
          statusCode: 400,
          code: 'VALIDATION_ERROR',
          errors: error.errors,
        })
      );
    }
  };
};

export const validateId = validateParam('id', z.string().cuid());
export const validateUuid = validateParam('id', z.string().uuid());
export const validateUserId = validateParam('userId', z.string().cuid());
