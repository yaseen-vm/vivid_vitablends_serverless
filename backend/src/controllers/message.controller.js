import * as reviewService from '../services/review.service.js';

export const create = async (req, res, next) => {
  try {
    const review = await reviewService.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const reviews = await reviewService.getAll(req.query);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};
