import * as categoryService from '../services/category.service.js';
import { clearCache } from '../middleware/cache.js';

export const create = async (req, res, next) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const categories = await categoryService.getAll();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getHomepageCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getHomepageCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const updateHomepageVisibility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { showOnHome, displayOrder } = req.body;
    const category = await categoryService.updateHomepageVisibility(
      id,
      showOnHome,
      displayOrder
    );

    // Clear relevant caches
    clearCache('categories:all');
    clearCache('categories:homepage');

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.update(id, req.body);

    clearCache('categories:all');
    clearCache('categories:homepage');

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};
