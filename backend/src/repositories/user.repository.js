import prisma from '../utils/prisma.js';

export const findByPhone = async (phone) => {
  return prisma.user.findUnique({ where: { phone } });
};

export const create = async (data) => {
  return prisma.user.create({ data });
};
