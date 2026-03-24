import * as categoryService from '../services/category.service.js';
import { clearCache } from '../middleware/cache.js';

export const create = async (c) => {
  try {
    const category = await categoryService.create(await c.req.json());

    // Clear relevant caches
    clearCache('categories:all');
    clearCache('categories:homepage');

    return c.json({ success: true, data: category }, 201);
  } catch (error) {
    throw error;
  }
};

export const getAll = async (c) => {
  try {
    const categories = await categoryService.getAll();
    return c.json({ success: true, data: categories }, 200);
  } catch (error) {
    throw error;
  }
};

export const getHomepageCategories = async (c) => {
  try {
    const categories = await categoryService.getHomepageCategories();
    return c.json({ success: true, data: categories }, 200);
  } catch (error) {
    throw error;
  }
};

export const updateHomepageVisibility = async (c) => {
  try {
    const { id } = c.req.param();
    const { showOnHome, displayOrder } = await c.req.json();
    const category = await categoryService.updateHomepageVisibility(
      id,
      showOnHome,
      displayOrder
    );

    // Clear relevant caches
    clearCache('categories:all');
    clearCache('categories:homepage');

    return c.json({ success: true, data: category }, 200);
  } catch (error) {
    throw error;
  }
};

export const update = async (c) => {
  try {
    const { id } = c.req.param();
    const category = await categoryService.update(id, await c.req.json());

    clearCache('categories:all');
    clearCache('categories:homepage');

    return c.json({ success: true, data: category }, 200);
  } catch (error) {
    throw error;
  }
};
