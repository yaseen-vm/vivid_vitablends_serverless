import * as reviewService from '../services/review.service.js';

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      showInHero: req.query.showInHero,
      limit: req.query.limit,
    };
    const reviews = await reviewService.getAll(filters);
    res
      .status(200)
      .json({ success: true, data: reviews, count: reviews.length });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const review = await reviewService.create(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};
