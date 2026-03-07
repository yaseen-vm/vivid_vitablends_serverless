import { useState, useEffect } from "react";
import { productApi } from "@/services/api/productApi";
import { Product } from "@/types/Product";
import { toast } from "sonner";

export const useProducts = (category?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getAll();
        setProducts(
          category ? data.filter((p) => p.category === category) : data
        );
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  return { products, loading };
};

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getFeatured();
        setProducts(data);
      } catch {
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, loading };
};

export const useCombos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getCombos();
        setProducts(data);
      } catch {
        toast.error("Failed to load combo offers");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, loading };
};
