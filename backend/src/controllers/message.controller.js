import * as messageService from '../services/message.service.js';

export const create = async (req, res, next) => {
  try {
    const message = await messageService.create(req.body);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const messages = await messageService.getAll(req.query);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};
