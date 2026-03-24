import { Home, ShoppingCart, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
import { categoryApi } from "@/services/api/categoryApi";
import { Product } from "@/types/Product";
import { Category } from "@/types/Category";
import { useState, useMemo, useEffect } from "react";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cartCount, addToCart } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { products: allProducts } = useProducts();

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        // Only show categories with showOnHome: true
        setCategories(data.filter((cat) => cat.showOnHome));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Set active category from URL params on mount only
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && categories.length > 0) {
      const matchedCategory = categories.find(
        (cat) =>
          cat.name.toLowerCase() === categoryParam.toLowerCase() ||
          cat.id === categoryParam
      );
      if (matchedCategory) {
        setActiveCategory(matchedCategory.id);
      }
    }
  }, [categories, searchParams]);

  // Filter products by category and search
  const products = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.categoryId === activeCategory
      );
    } else {
      // When "All" is selected, only show products from visible categories
      const visibleCategoryIds = categories.map((cat) => cat.id);
      filtered = filtered.filter((product) =>
        visibleCategoryIds.includes(product.categoryId)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allProducts, activeCategory, searchTerm, categories]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = (product: Product) => {
    navigate("/checkout", {
      state: {
        buyNowItem: {
          ...product,
          quantity: 1,
        },
      },
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  // Create category options for tabs
  const categoryOptions = [
    { label: "All", value: "all" },
    ...categories.map((cat) => ({ label: cat.name, value: cat.id })),
  ];

  return (
    <main className="min-h-screen bg-secondary">
      {/* ================= TOP BAR ================= */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-warm-gold to-amber-600 px-4 py-3 shadow-lg md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
            aria-label="Go to home"
          >
            <Home size={20} />
          </button>

          <h1 className="font-display text-base font-bold tracking-wide text-white md:text-xl">
            Our Products
          </h1>

          <button
            onClick={() => navigate("/cart")}
            className="relative rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
            aria-label="View cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ================= SEARCH BAR ================= */}
      <div className="bg-gradient-to-b from-secondary to-background px-4 pt-4 pb-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border-2 border-border bg-card py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-warm-gold focus:ring-2 focus:ring-warm-gold/20"
            />
          </div>
        </div>
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <div className="px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-7xl">
          {/* ================= PAGE TAGLINE ================= */}
          <div className="mb-6 text-center md:mb-10">
            <p className="text-xs leading-relaxed text-muted-foreground md:text-xl md:font-semibold md:text-foreground">
              Pure ingredients, traditional recipes, and wholesome goodness in
              every product.
            </p>
          </div>

          {/* ================= TAB BAR ================= */}
          <div className="mb-8 flex justify-center md:mb-14">
            <div className="flex flex-wrap justify-center gap-2 rounded-2xl bg-card p-2 shadow-md">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`rounded-xl px-3 py-2 text-xs font-medium transition-all capitalize md:px-4 md:text-sm ${
                    activeCategory === cat.value
                      ? "bg-warm-gold text-white shadow-md scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ================= PRODUCT GRID ================= */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm
                  ? `No products found for "${searchTerm}"`
                  : "No products found in this category."}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-warm-gold hover:underline font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => {
                const isOutOfStock = product.inStock === false;
                return (
                  <div
                    key={product.id}
                    className="group rounded-xl bg-card p-3 shadow-sm transition-all hover:shadow-lg md:rounded-2xl md:p-5"
                  >
                    <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted p-2 md:mb-4 md:rounded-xl md:p-3 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      {isOutOfStock && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] md:text-xs font-bold px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <h3 className="mb-1 text-xs font-semibold text-foreground line-clamp-2 md:mb-2 md:text-sm">
                      {product.name}
                    </h3>

                    <p className="mb-2 text-[10px] text-muted-foreground line-clamp-2 md:mb-4 md:text-xs">
                      {product.description}
                    </p>

                    <p className="mb-3 text-sm font-bold text-green-600 md:mb-4 md:text-base">
                      ₹{product.price}
                    </p>

                    <div className="flex flex-col gap-2 md:flex-row">
                      <button
                        onClick={() => handleBuyNow(product)}
                        disabled={isOutOfStock}
                        className="flex-1 rounded-lg bg-warm-gold px-3 py-2 text-[10px] font-semibold text-white transition-all hover:bg-amber-600 active:scale-95 md:text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-warm-gold"
                      >
                        {isOutOfStock ? "Out of Stock" : "Buy Now"}
                      </button>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={isOutOfStock}
                        className="flex-1 rounded-lg border-2 border-warm-gold px-3 py-2 text-[10px] font-semibold text-warm-gold transition-all hover:bg-warm-gold hover:text-white active:scale-95 md:text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-warm-gold"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
