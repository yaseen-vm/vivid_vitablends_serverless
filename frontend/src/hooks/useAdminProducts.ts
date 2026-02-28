import { useState, useEffect, useCallback, useMemo } from "react";
import { productApi, categoryApi } from "@/services/api/productApi";
import { Product } from "@/types/Product";
import { toast } from "sonner";

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data.map((c) => c.name));
    } catch (err) {
      // Fallback to default categories if API fails
      setCategories(["health", "pickle", "combo"]);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const stats = useMemo(() => {
    const byCategory = {
      health: products.filter((p) => p.category === "health").length,
      pickle: products.filter((p) => p.category === "pickle").length,
      combo: products.filter((p) => p.category === "combo").length,
    };
    const featuredCount = products.filter((p) => p.featured).length;

    return { byCategory, featuredCount, total: products.length };
  }, [products]);

  const createProduct = async (product: Omit<Product, "id">) => {
    try {
      await productApi.create(product);
      toast.success("Product created successfully");
      await fetchProducts();
    } catch (err) {
      toast.error("Failed to create product");
      throw err;
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      await productApi.update(id, product);
      toast.success("Product updated successfully");
      await fetchProducts();
    } catch (err) {
      toast.error("Failed to update product");
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productApi.delete(id);
      toast.success("Product deleted successfully");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error("Failed to delete product");
      throw err;
    }
  };

  const createCategory = async (name: string) => {
    try {
      await categoryApi.create(name);
      toast.success("Category created successfully");
      await fetchCategories();
      return true;
    } catch (err) {
      toast.error("Failed to create category");
      return false;
    }
  };

  return {
    products,
    categories,
    loading,
    stats,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    refetch: fetchProducts,
  };
};
