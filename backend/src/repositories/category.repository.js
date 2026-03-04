import prisma from '../utils/prisma.js';

export const create = async (data) => {
  return prisma.category.create({ data });
};

export const findAll = async () => {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
};

export const findHomepageCategories = async () => {
  return prisma.category.findMany({
    where: { showOnHome: true },
    orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
  });
};

export const findById = async (id) => {
  return prisma.category.findUnique({ where: { id } });
};

export const findByName = async (name) => {
  return prisma.category.findUnique({ where: { name } });
};

export const update = async (id, data) => {
  return prisma.category.update({ where: { id }, data });
};
