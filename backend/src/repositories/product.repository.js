import prisma from '../utils/prisma.js';
import { clearCache } from '../middleware/cache.js';

export const findFeatured = async () => {
  return prisma.product.findMany({
    where: { featured: true },
  });
};

export const findAll = async (filters = {}) => {
  const where = {};
  if (filters.category) where.category = filters.category;
  if (filters.featured !== undefined)
    where.featured = filters.featured === 'true';

  return prisma.product.findMany({ where });
};

export const findByCategory = async (category) => {
  return prisma.product.findMany({
    where: { category },
  });
};

export const findById = async (id) => {
  return prisma.product.findUnique({
    where: { id },
  });
};

export const create = async (data) => {
  const product = await prisma.product.create({ data });
  await clearCache('/api/products*');
  return product;
};

export const update = async (id, data) => {
  const product = await prisma.product.update({ where: { id }, data });
  await clearCache('/api/products*');
  return product;
};

export const deleteProduct = async (id) => {
  await prisma.product.delete({ where: { id } });
  await clearCache('/api/products*');
};
