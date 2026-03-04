import * as productService from '../services/product.service.js';

export const getFeatured = async (req, res, next) => {
  try {
    const products = await productService.getFeatured();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const filters = {
      categoryId: req.query.categoryId,
      featured: req.query.featured,
    };
    const products = await productService.getAll(filters);
    res
      .status(200)
      .json({ success: true, data: products, count: products.length });
  } catch (error) {
    next(error);
  }
};

export const getCombos = async (req, res, next) => {
  try {
    const combos = await productService.getCombos();
    res.status(200).json({ success: true, data: combos });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const product = await productService.getById(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    res
      .status(200)
      .json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
