import * as messageService from '../services/message.service.js';

export const create = async (c) => {
  try {
    const message = await messageService.create(await c.req.json());
    return c.json({ success: true, data: message }, 201);
  } catch (error) {
    throw error;
  }
};

export const getAll = async (c) => {
  try {
    const messages = await messageService.getAll(c.req.query());
    return c.json({ success: true, data: messages }, 200);
  } catch (error) {
    throw error;
  }
};
