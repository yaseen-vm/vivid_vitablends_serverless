import { API_BASE_URL } from "@/lib/config";
import { apiClient } from "@/lib/apiClient";
import { Product } from "@/types/Product";
import { Category } from "@/types/Category";

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const res = await fetch(`${API_BASE_URL}/api/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const json = await res.json();
    return json.data || json;
  },

  getFeatured: async (): Promise<Product[]> => {
    const res = await fetch(`${API_BASE_URL}/api/products/featured`);
    if (!res.ok) throw new Error("Failed to fetch featured products");
    const json = await res.json();
    return json.data || json;
  },

  getCombos: async (): Promise<Product[]> => {
    const res = await fetch(`${API_BASE_URL}/api/products/combos`);
    if (!res.ok) throw new Error("Failed to fetch combos");
    const json = await res.json();
    return json.data || json;
  },

  getById: async (id: string): Promise<Product> => {
    const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch product");
    return res.json();
  },

  create: async (product: Omit<Product, "id">): Promise<Product> => {
    const res = await apiClient(`${API_BASE_URL}/api/products`, {
      method: "POST",
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to create product");
    const json = await res.json();
    return json.data || json;
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const res = await apiClient(`${API_BASE_URL}/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Failed to update product");
    const json = await res.json();
    return json.data || json;
  },

  delete: async (id: string): Promise<void> => {
    const res = await apiClient(`${API_BASE_URL}/api/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete product");
  },
};

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await fetch(`${API_BASE_URL}/api/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    const json = await res.json();
    return json.data || [];
  },

  create: async (name: string): Promise<Category> => {
    const res = await apiClient(`${API_BASE_URL}/api/categories`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to create category");
    const json = await res.json();
    return json.data;
  },
};
