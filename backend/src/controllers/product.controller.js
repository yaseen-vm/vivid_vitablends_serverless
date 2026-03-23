import * as productService from '../services/product.service.js';

export const getFeatured = async (c) => {
  try {
    const products = await productService.getFeatured();
    return c.json({ success: true, data: products }, 200);
  } catch (error) {
    throw error;
  }
};

export const getAll = async (c) => {
  try {
    const filters = {
      categoryId: c.req.query().categoryId,
      featured: c.req.query().featured,
    };
    const products = await productService.getAll(filters);
    return c.json(
      { success: true, data: products, count: products.length },
      200
    );
  } catch (error) {
    throw error;
  }
};

export const getCombos = async (c) => {
  try {
    const combos = await productService.getCombos();
    return c.json({ success: true, data: combos }, 200);
  } catch (error) {
    throw error;
  }
};

export const getById = async (c) => {
  try {
    const product = await productService.getById(c.req.param().id);
    return c.json({ success: true, data: product }, 200);
  } catch (error) {
    throw error;
  }
};

export const create = async (c) => {
  try {
    const product = await productService.create(await c.req.json());
    return c.json({ success: true, data: product }, 201);
  } catch (error) {
    throw error;
  }
};

export const update = async (c) => {
  try {
    const product = await productService.update(
      c.req.param().id,
      await c.req.json()
    );
    return c.json({ success: true, data: product }, 200);
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (c) => {
  try {
    await productService.deleteProduct(c.req.param().id);
    return c.json(
      { success: true, message: 'Product deleted successfully' },
      200
    );
  } catch (error) {
    throw error;
  }
};
