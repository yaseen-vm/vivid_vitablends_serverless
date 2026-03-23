import * as orderService from '../services/order.service.js';
import logger from '../utils/logger.js';

export const create = async (c) => {
  try {
    logger.info('Order creation attempt', {
      hasCustomerName: !!(await c.req.json()).customerName,
      hasPhone: !!(await c.req.json()).phone,
      hasItems: Array.isArray((await c.req.json()).items),
      itemCount: (await c.req.json()).items?.length || 0,
    });
    const order = await orderService.create(await c.req.json());
    return c.json(
      {
        success: true,
        message: 'Order created successfully',
        data: order,
      },
      201
    );
  } catch (error) {
    throw error;
  }
};

export const getAll = async (c) => {
  try {
    logger.info('Fetching all orders', { userId: c.get('user')?.id });
    const orders = await orderService.getAll();
    logger.info('Orders fetched', { count: orders.length });
    return c.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    logger.error('Failed to fetch orders', { error: error.message });
    throw error;
  }
};

export const updateStatus = async (c) => {
  try {
    const { id } = c.req.param();
    const { status } = await c.req.json();
    const order = await orderService.updateStatus(id, status);
    return c.json({
      success: true,
      data: order,
    });
  } catch (error) {
    throw error;
  }
};

export const getByUserId = async (c) => {
  try {
    const { userId } = c.req.param();
    const orders = await orderService.getByUserId(userId);
    return c.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    throw error;
  }
};
