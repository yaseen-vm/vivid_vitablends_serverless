import * as reviewService from '../services/review.service.js';

export const getAll = async (c) => {
  try {
    const filters = {
      showInHero: c.req.query().showInHero,
      limit: c.req.query().limit,
    };
    const reviews = await reviewService.getAll(filters);
    return c.json({ success: true, data: reviews, count: reviews.length }, 200);
  } catch (error) {
    throw error;
  }
};

export const getHeroReviews = async (c) => {
  try {
    const reviews = await reviewService.getHeroReviews();
    return c.json({ success: true, data: reviews, count: reviews.length }, 200);
  } catch (error) {
    throw error;
  }
};

export const create = async (c) => {
  try {
    const review = await reviewService.create(await c.req.json());
    return c.json({ success: true, data: review }, 201);
  } catch (error) {
    throw error;
  }
};

export const updateShowInHero = async (c) => {
  try {
    const { id } = c.req.param();
    const { showInHero } = await c.req.json();
    const review = await reviewService.updateShowInHero(id, showInHero);
    return c.json({ success: true, data: review }, 200);
  } catch (error) {
    throw error;
  }
};
