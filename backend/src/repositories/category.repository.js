import prisma from '../utils/prisma.js';

export const create = async (data) => {
  return prisma.category.create({ data });
};

export const findAll = async () => {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
};

export const findByName = async (name) => {
  return prisma.category.findUnique({ where: { name } });
};
