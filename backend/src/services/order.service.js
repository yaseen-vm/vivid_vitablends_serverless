import * as orderRepository from '../repositories/order.repository.js';
import prisma from '../utils/prisma.js';
import logger from '../utils/logger.js';

const validateOrderData = (data) => {
  const errors = [];

  if (
    !data.customerName ||
    typeof data.customerName !== 'string' ||
    data.customerName.trim() === ''
  ) {
    errors.push({
      field: 'customerName',
      message: 'Customer name is required',
    });
  }

  if (
    !data.phone ||
    typeof data.phone !== 'string' ||
    !/^\d{10}$/.test(data.phone)
  ) {
    errors.push({ field: 'phone', message: 'Phone number must be 10 digits' });
  }

  if (
    !data.address ||
    typeof data.address !== 'string' ||
    data.address.trim() === ''
  ) {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  if (!data.city || typeof data.city !== 'string' || data.city.trim() === '') {
    errors.push({ field: 'city', message: 'City is required' });
  }

  if (
    !data.state ||
    typeof data.state !== 'string' ||
    data.state.trim() === ''
  ) {
    errors.push({ field: 'state', message: 'State is required' });
  }

  if (
    !data.pincode ||
    typeof data.pincode !== 'string' ||
    !/^\d{6}$/.test(data.pincode)
  ) {
    errors.push({ field: 'pincode', message: 'Pincode must be 6 digits' });
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push({
      field: 'items',
      message: 'Order must contain at least one item',
    });
  } else {
    data.items.forEach((item, index) => {
      if (!item.productId || !item.name || !item.quantity || !item.price) {
        errors.push({
          field: `items[${index}]`,
          message: 'Invalid item structure',
        });
      }
    });
  }

  if (typeof data.total !== 'number' || data.total <= 0) {
    errors.push({ field: 'total', message: 'Total must be a positive number' });
  }

  if (errors.length > 0) {
    const error = new Error('Invalid order data');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    error.errors = errors;
    logger.warn('Order validation failed', { errors });
    throw error;
  }
};

const generateOrderId = () => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const randomNum = (array[0] % 900000) + 100000;
  return `VV-${randomNum}`;
};

export const create = async (data) => {
  validateOrderData(data);

  return await prisma.$transaction(async (tx) => {
    // Verify all products exist and get their prices
    const productIds = data.items.map((item) => item.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, name: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    const missingIds = productIds.filter((id) => !productMap.has(id));

    if (missingIds.length > 0) {
      logger.warn('Order validation failed - invalid products', { missingIds });
      throw Object.assign(new Error('One or more products do not exist'), {
        statusCode: 400,
        code: 'INVALID_PRODUCT',
        errors: [
          {
            field: 'items',
            message: `Invalid product IDs: ${missingIds.join(', ')}`,
          },
        ],
      });
    }

    // Recalculate and validate prices/total
    let calculatedTotal = 0;
    const verifiedItems = data.items.map((item) => {
      const dbProduct = productMap.get(item.productId);
      const itemTotal = dbProduct.price * item.quantity;
      calculatedTotal += itemTotal;

      // Optional: Check if price matches (useful for detecting manipulation attempts)
      if (Math.abs(item.price - dbProduct.price) > 0.01) {
        logger.warn('Price mismatch detected', {
          productId: item.productId,
          clientPrice: item.price,
          dbPrice: dbProduct.price,
        });
      }

      return {
        productId: item.productId,
        name: dbProduct.name, // Use DB name to be safe
        quantity: item.quantity,
        price: dbProduct.price, // Use DB price for final order
      };
    });

    // Validate total (allowing for small rounding differences in floats)
    if (Math.abs(calculatedTotal - data.total) > 0.01) {
      logger.error('Order total mismatch', {
        clientTotal: data.total,
        calculatedTotal,
      });
      throw Object.assign(new Error('Order total mismatch'), {
        statusCode: 400,
        code: 'PRICE_MISMATCH',
      });
    }

    let user = await tx.user.findUnique({ where: { phone: data.phone } });

    if (!user) {
      user = await tx.user.create({
        data: {
          name: data.customerName,
          phone: data.phone,
        },
      });
      logger.info('New user created', { userId: user.id, phone: user.phone });
    }

    let orderId;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      orderId = generateOrderId();
      const existing = await tx.order.findUnique({ where: { orderId } });
      if (!existing) break;
      attempts++;
      logger.warn('Order ID collision, retrying', {
        orderId,
        attempt: attempts,
      });
    }

    if (attempts === maxAttempts) {
      const error = new Error('Failed to generate unique order ID');
      error.statusCode = 500;
      error.code = 'ORDER_ID_GENERATION_FAILED';
      throw error;
    }

    logger.info('Creating order', {
      orderId,
      userId: user.id,
      total: calculatedTotal,
      itemCount: verifiedItems.length,
    });

    return await tx.order.create({
      data: {
        orderId,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        total: calculatedTotal,
        userId: user.id,
        items: {
          create: verifiedItems,
        },
      },
      include: {
        items: true,
      },
    });
  });
};

export const getAll = async () => {
  return await orderRepository.findAll();
};

export const updateStatus = async (id, status) => {
  const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'DELIVERED'];
  if (!validStatuses.includes(status)) {
    const error = new Error('Invalid status');
    error.statusCode = 400;
    error.code = 'INVALID_STATUS';
    throw error;
  }

  // Get current order status
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    error.code = 'ORDER_NOT_FOUND';
    throw error;
  }

  const currentStatus = order.status;

  // Validate status transitions
  const allowedTransitions = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['DELIVERED', 'CANCELLED'],
    CANCELLED: [], // Final state
    DELIVERED: [], // Final state
  };

  if (!allowedTransitions[currentStatus]?.includes(status)) {
    const error = new Error(
      `Cannot change status from ${currentStatus} to ${status}`
    );
    error.statusCode = 400;
    error.code = 'INVALID_STATUS_TRANSITION';
    throw error;
  }

  return await orderRepository.updateStatus(id, status);
};

export const getByUserId = async (userId) => {
  return await orderRepository.findByUserId(userId);
};
