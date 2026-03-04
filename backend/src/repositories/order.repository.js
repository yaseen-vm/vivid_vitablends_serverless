import prisma from '../utils/prisma.js';

export const create = async (data) => {
  return prisma.order.create({
    data: {
      orderId: data.orderId,
      userId: data.userId,
      customerName: data.customerName,
      phone: data.phone,
      address: data.address,
      city: data.city,
      pincode: data.pincode,
      total: data.total,
      whatsappSent: data.sendWhatsApp || false,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: {
      items: true,
      user: true,
    },
  });
};

export const findAll = async () => {
  return prisma.order.findMany({
    include: {
      items: true,
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const updateStatus = async (id, status) => {
  return prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: true,
      user: true,
    },
  });
};

export const findByUserId = async (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const findByOrderId = async (orderId) => {
  return prisma.order.findUnique({
    where: { orderId },
  });
};
