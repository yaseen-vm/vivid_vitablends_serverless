import prisma from '../utils/prisma.js';

export const createSession = async (data) => {
  return prisma.session.create({ data });
};

export const findByTokenHash = async (refreshTokenHash) => {
  return prisma.session.findUnique({
    where: { refreshTokenHash },
    include: { admin: true },
  });
};

export const deleteSession = async (refreshTokenHash) => {
  return prisma.session.delete({ where: { refreshTokenHash } });
};

export const revokeAllUserSessions = async (adminId) => {
  return prisma.session.updateMany({
    where: { adminId },
    data: { revoked: true },
  });
};

export const deleteExpiredSessions = async () => {
  return prisma.session.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: new Date() } }, { revoked: true }],
    },
  });
};
