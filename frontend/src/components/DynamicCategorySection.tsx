import { useNavigate } from "react-router-dom";
import { productApi } from "@/services/api/productApi";
import { Product } from "@/types/Product";
import { useState, useEffect } from "react";

interface DynamicCategorySectionProps {
  categoryId: string;
  title: string;
  subtitle?: string;
  maxProducts?: number;
}

const DynamicCategorySection = ({
  categoryId,
  title,
  subtitle,
  maxProducts = 3,
}: DynamicCategorySectionProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getByCategory(categoryId);
        setProducts(data.slice(0, maxProducts));
      } catch (error) {
        console.error(
          `Failed to fetch products for category ${categoryId}:`,
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, maxProducts]);

  if (loading || products.length === 0) return null;

  return (
    <section className="section-padding bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold capitalize md:text-4xl">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-xl bg-card shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-accent">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => navigate(`/products?category=${categoryId}`)}
                    className="text-sm text-accent hover:underline"
                  >
                    View All →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicCategorySection;
