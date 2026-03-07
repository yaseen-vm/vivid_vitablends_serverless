import prisma from '../utils/prisma.js';

export const create = async (data) => {
  return prisma.message.create({ data });
};

export const getAll = async (query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.message.count(),
  ]);

  return { messages, total, page: parseInt(page), limit: parseInt(limit) };
};
