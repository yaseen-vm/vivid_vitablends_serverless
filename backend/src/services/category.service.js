import * as categoryRepository from '../repositories/category.repository.js';
import { uploadImage } from '../utils/r2.js';
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

export const getHomepageCategories = async () => {
  return categoryRepository.findHomepageCategories();
};

export const updateHomepageVisibility = async (
  id,
  showOnHome,
  displayOrder
) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw Object.assign(new Error('Category not found'), {
      statusCode: 404,
      code: 'CATEGORY_NOT_FOUND',
    });
  }

  const updatedCategory = await categoryRepository.update(id, {
    showOnHome,
    displayOrder: displayOrder || 0,
  });
  logger.info('Category homepage visibility updated', {
    id,
    showOnHome,
    displayOrder,
  });
  return updatedCategory;
};

export const update = async (id, data) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw Object.assign(new Error('Category not found'), {
      statusCode: 404,
      code: 'CATEGORY_NOT_FOUND',
    });
  }

  if (data.name && data.name !== category.name) {
    const existing = await categoryRepository.findByName(data.name.trim());
    if (existing) {
      throw Object.assign(new Error('Category name already exists'), {
        statusCode: 409,
        code: 'CATEGORY_EXISTS',
      });
    }
  }

  // Upload image to R2 if base64 provided
  if (data.image && data.image.startsWith('data:image/')) {
    const fileName = `category-${id}`;
    data.image = await uploadImage(data.image, fileName);
  }

  const updatedCategory = await categoryRepository.update(id, data);
  const { image, ...safeData } = data;
  logger.info('Category updated', { id, ...safeData, hasImage: !!image });
  return updatedCategory;
};
