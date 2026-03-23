import * as comingSoonService from '../services/comingSoon.service.js';
import logger from '../utils/logger.js';

export const getAll = async (c) => {
  try {
    logger.info('Fetching all coming soon products');
    const products = await comingSoonService.getAll();
    return c.json({ success: true, data: products }, 200);
  } catch (error) {
    throw error;
  }
};

export const addOrRemove = async (c) => {
  try {
    logger.info('Add or remove coming soon product request', {
      hasId: !!(await c.req.json()).id,
    });
    const result = await comingSoonService.addOrRemove(await c.req.json());
    return c.json({ success: true, data: result }, 200);
  } catch (error) {
    throw error;
  }
};
