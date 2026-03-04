import * as productRepository from '../repositories/product.repository.js';
import * as categoryRepository from '../repositories/category.repository.js';
import * as imageService from './image.service.js';
import logger from '../utils/logger.js';

const validateProductData = (data, isUpdate = false) => {
  if (!isUpdate) {
    if (
      !data.name ||
      !data.description ||
      data.price === undefined ||
      !data.image ||
      !data.categoryId
    ) {
      throw Object.assign(
        new Error(
          'Missing required fields: name, description, price, image, categoryId'
        ),
        {
          statusCode: 400,
          code: 'VALIDATION_ERROR',
        }
      );
    }
  }

  if (data.categoryId && typeof data.categoryId !== 'string') {
    throw Object.assign(new Error('Invalid categoryId format'), {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
    });
  }

  if (
    data.price !== undefined &&
    (typeof data.price !== 'number' || data.price <= 0)
  ) {
    throw Object.assign(new Error('Price must be a positive number'), {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
    });
  }

  if (
    data.originalPrice !== undefined &&
    (typeof data.originalPrice !== 'number' || data.originalPrice <= 0)
  ) {
    throw Object.assign(new Error('Original price must be a positive number'), {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
    });
  }
};

export const getFeatured = async () => {
  logger.info('Fetching featured products');
  return productRepository.findFeatured();
};

export const getAll = async (filters) => {
  logger.info('Fetching all products', { filters });
  return productRepository.findAll(filters);
};

export const getCombos = async () => {
  logger.info('Fetching combo products');
  const comboCategory = await categoryRepository.findByName('combo');
  if (!comboCategory) return [];
  return productRepository.findByCategoryId(comboCategory.id);
};

export const getById = async (id) => {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    logger.warn('Invalid product ID provided', { id });
    throw Object.assign(new Error('Invalid product ID'), {
      statusCode: 400,
      code: 'INVALID_PRODUCT_ID',
    });
  }

  logger.info('Fetching product by ID', { productId: id });
  const product = await productRepository.findById(id);

  if (!product) {
    logger.warn('Product not found', { productId: id });
    throw Object.assign(new Error('Product not found'), {
      statusCode: 404,
      code: 'PRODUCT_NOT_FOUND',
    });
  }

  return product;
};

export const create = async (data) => {
  logger.info('Creating product', { productName: data.name });
  validateProductData(data);

  const categoryExists = await categoryRepository.findById(data.categoryId);
  if (!categoryExists) {
    throw Object.assign(new Error('Category not found'), {
      statusCode: 404,
      code: 'CATEGORY_NOT_FOUND',
    });
  }

  if (data.image && data.image.startsWith('data:')) {
    data.image = await imageService.upload(data.image);
  }

  const product = await productRepository.create(data);
  logger.info('Product created', {
    productId: product.id,
    productName: product.name,
  });
  return product;
};

export const update = async (id, data) => {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    logger.warn('Invalid product ID provided', { id });
    throw Object.assign(new Error('Invalid product ID'), {
      statusCode: 400,
      code: 'INVALID_PRODUCT_ID',
    });
  }

  if (!data || Object.keys(data).length === 0) {
    logger.warn('No update data provided', { productId: id });
    throw Object.assign(
      new Error('At least one field must be provided for update'),
      {
        statusCode: 400,
        code: 'VALIDATION_ERROR',
      }
    );
  }

  logger.info('Updating product', { productId: id });
  validateProductData(data, true);

  const exists = await productRepository.findById(id);
  if (!exists) {
    logger.warn('Product not found for update', { productId: id });
    throw Object.assign(new Error('Product not found'), {
      statusCode: 404,
      code: 'PRODUCT_NOT_FOUND',
    });
  }

  if (data.categoryId) {
    const categoryExists = await categoryRepository.findById(data.categoryId);
    if (!categoryExists) {
      throw Object.assign(new Error('Category not found'), {
        statusCode: 404,
        code: 'CATEGORY_NOT_FOUND',
      });
    }
  }

  if (data.image && data.image.startsWith('data:')) {
    data.image = await imageService.upload(data.image);
  }

  const product = await productRepository.update(id, data);
  logger.info('Product updated', { productId: id });
  return product;
};

export const deleteProduct = async (id) => {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    logger.warn('Invalid product ID provided', { id });
    throw Object.assign(new Error('Invalid product ID'), {
      statusCode: 400,
      code: 'INVALID_PRODUCT_ID',
    });
  }

  logger.info('Deleting product', { productId: id });

  const exists = await productRepository.findById(id);
  if (!exists) {
    logger.warn('Product not found for deletion', { productId: id });
    throw Object.assign(new Error('Product not found'), {
      statusCode: 404,
      code: 'PRODUCT_NOT_FOUND',
    });
  }

  await productRepository.deleteProduct(id);
  logger.info('Product deleted', { productId: id });
};
