import * as categoryRepository from '../repositories/category.repository.js';
import logger from '../utils/logger.js';

export const create = async (data) => {
  if (!data.name || data.name.trim() === '') {
    throw Object.assign(new Error('Category name is required'), {
      statusCode: 400,
      code: 'INVALID_INPUT',
    });
  }

  const existing = await categoryRepository.findByName(data.name.trim());
  if (existing) {
    logger.warn('Duplicate category attempt', { name: data.name });
    throw Object.assign(new Error('Category already exists'), {
      statusCode: 409,
      code: 'CATEGORY_EXISTS',
    });
  }

  const category = await categoryRepository.create({ name: data.name.trim() });
  logger.info('Category created', { id: category.id, name: category.name });
  return category;
};

export const getAll = async () => {
  return categoryRepository.findAll();
};
