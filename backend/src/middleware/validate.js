import logger from '../utils/logger.js';
import { z } from 'zod';

export const validate = (schema) => {
  return async (c, next) => {
    try {
      // Hono caches the body so calling req.json() here and in controller is safe
      const body = await c.req.json();
      schema.parse(body);
      await next();
    } catch (error) {
      logger.warn('Validation failed', {
        errors: error.errors,
        path: c.req.path,
      });
      return c.json(
        {
          success: false,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: error.errors,
        },
        400
      );
    }
  };
};

export const validateQuery = (schema) => {
  return async (c, next) => {
    try {
      schema.parse(c.req.query());
      await next();
    } catch (error) {
      logger.warn('Query validation failed', {
        errors: error.errors,
        path: c.req.path,
      });
      return c.json(
        {
          success: false,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: error.errors,
        },
        400
      );
    }
  };
};

export const validateParam = (paramName, schema) => {
  return async (c, next) => {
    try {
      schema.parse(c.req.param(paramName));
      await next();
    } catch (error) {
      logger.warn('Param validation failed', {
        errors: error.errors,
        path: c.req.path,
      });
      return c.json(
        {
          success: false,
          message: 'Invalid parameter',
          code: 'VALIDATION_ERROR',
          errors: error.errors,
        },
        400
      );
    }
  };
};

export const validateId = validateParam('id', z.string().cuid());
export const validateUuid = validateParam('id', z.string().uuid());
export const validateUserId = validateParam('userId', z.string().cuid());
