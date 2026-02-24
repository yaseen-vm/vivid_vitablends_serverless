import * as reviewRepository from '../repositories/review.repository.js';
import logger from '../utils/logger.js';

export const getAll = async (filters) => {
  if (filters.limit && (isNaN(filters.limit) || parseInt(filters.limit) <= 0)) {
    logger.warn('Invalid limit parameter', { limit: filters.limit });
    const error = new Error('Limit must be a positive integer');
    error.statusCode = 400;
    error.code = 'INVALID_LIMIT';
    throw error;
  }

  logger.info('Fetching reviews', { filters });
  return reviewRepository.findAll(filters);
};

export const create = async (data) => {
  if (!data.name || !data.rating || !data.comment) {
    logger.warn('Missing required fields', { data });
    const error = new Error('Name, rating, and comment are required');
    error.statusCode = 400;
    error.code = 'MISSING_FIELDS';
    throw error;
  }

  if (typeof data.name !== 'string' || data.name.trim().length < 2) {
    logger.warn('Invalid name', { name: data.name });
    const error = new Error('Name must be at least 2 characters');
    error.statusCode = 400;
    error.code = 'INVALID_NAME';
    throw error;
  }

  if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
    logger.warn('Invalid rating', { rating: data.rating });
    const error = new Error('Rating must be between 1 and 5');
    error.statusCode = 400;
    error.code = 'INVALID_RATING';
    throw error;
  }

  if (typeof data.comment !== 'string' || data.comment.trim().length < 5) {
    logger.warn('Invalid comment', { comment: data.comment });
    const error = new Error('Comment must be at least 5 characters');
    error.statusCode = 400;
    error.code = 'INVALID_COMMENT';
    throw error;
  }

  logger.info('Creating review', { name: data.name, rating: data.rating });
  return reviewRepository.create(data);
};
