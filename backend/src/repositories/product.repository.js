import prisma from '../utils/prisma.js';
import { clearCache } from '../middleware/cache.js';

export const findFeatured = async () => {
  return prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
  });
};

export const findAll = async (filters = {}) => {
  const where = {};
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.featured !== undefined)
    where.featured = filters.featured === 'true';

  return prisma.product.findMany({
    where,
    include: { category: true },
  });
};

export const findByCategoryId = async (categoryId) => {
  return prisma.product.findMany({
    where: { categoryId },
    include: { category: true },
  });
};

export const findById = async (id) => {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
};

export const create = async (data) => {
  const product = await prisma.product.create({ data });
  await clearCache('/api/products*');
  return product;
};

export const update = async (id, data) => {
  const product = await prisma.product.update({
    where: { id },
    data,
    include: { category: true },
  });
  await clearCache('/api/products*');
  return product;
};

export const deleteProduct = async (id) => {
  await prisma.product.delete({ where: { id } });
  await clearCache('/api/products*');
};
