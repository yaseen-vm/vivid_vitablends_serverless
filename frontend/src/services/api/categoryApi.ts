import { API_BASE_URL } from "@/lib/config";
import { apiClient } from "@/lib/apiClient";
import { Category } from "@/types/Category";

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await fetch(`${API_BASE_URL}/api/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    const json = await res.json();
    return json.data || [];
  },

  getHomepageCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${API_BASE_URL}/api/categories/homepage`);
    if (!res.ok) throw new Error("Failed to fetch homepage categories");
    const json = await res.json();
    return json.data || [];
  },

  create: async (name: string): Promise<Category> => {
    const res = await apiClient(`${API_BASE_URL}/api/categories`, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      if (res.status === 409) {
        throw new Error("Category already exists");
      }
      throw new Error("Failed to create category");
    }
    const json = await res.json();
    return json.data;
  },

  updateHomepageVisibility: async (
    id: string,
    showOnHome: boolean,
    displayOrder?: number
  ): Promise<Category> => {
    const res = await apiClient(
      `${API_BASE_URL}/api/categories/${id}/homepage`,
      {
        method: "PUT",
        body: JSON.stringify({ showOnHome, displayOrder }),
      }
    );
    if (!res.ok) throw new Error("Failed to update category");
    const json = await res.json();
    return json.data;
  },

  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const res = await apiClient(`${API_BASE_URL}/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      if (res.status === 409) {
        throw new Error("Category name already exists");
      }
      throw new Error("Failed to update category");
    }
    const json = await res.json();
    return json.data;
  },
};
