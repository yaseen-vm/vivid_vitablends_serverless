import prisma from '../utils/prisma.js';

export const findByUsername = async (username) => {
  return prisma.admin.findUnique({ where: { username } });
};

export const findById = async (id) => {
  return prisma.admin.findUnique({ where: { id } });
};

export const create = async (data) => {
  return prisma.admin.create({ data });
};
