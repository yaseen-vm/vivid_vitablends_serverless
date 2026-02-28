import * as categoryService from '../services/category.service.js';

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
