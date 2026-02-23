import { Home, ShoppingCart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/Product";
import { useState, useMemo } from "react";

const categories = [
  { label: "All", value: "all" },
  { label: "Powders", value: "health" },
  { label: "Pickles", value: "pickle" },
  { label: "Combos", value: "combo" },
];

const ProductsPage = () => {
  const navigate = useNavigate();
  const { cartCount, addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { products: filteredProducts } = useProducts(activeCategory);
  const { products: allProducts } = useProducts();

  const baseProducts =
    activeCategory === "all" ? allProducts : filteredProducts;

  // 🔎 Search Filtering
  const products = useMemo(() => {
    return baseProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [baseProducts, searchTerm]);

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

  return (
    <main className="min-h-screen bg-secondary">
      {/* ================= TOP BAR ================= */}
      <div className="sticky top-0 z-50 bg-zinc-400 px-5 py-4 shadow-md md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="rounded-lg p-2 text-black hover:bg-white/20"
          >
            <Home size={22} />
          </button>

          <h1 className="font-display text-xl font-bold tracking-wide text-black">
            Our Products
          </h1>

          <button
            onClick={() => navigate("/cart")}
            className="relative rounded-lg p-2 text-black hover:bg-white/20"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ================= SEARCH BAR ================= */}
      <div className="bg-secondary px-5 pt-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-border bg-card py-2 pl-10 pr-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <div className="px-5 py-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          {/* ================= PAGE TAGLINE ================= */}
          <div className="mb-10 text-center">
            <p className="text-sm md:text-2xl font-semibold text-foreground">
              Pure ingredients, traditional recipes, and wholesome goodness in
              every product.
            </p>
          </div>

          {/* ================= TAB BAR ================= */}
          <div className="mb-14 flex justify-center">
            <div className="flex rounded-full bg-card p-1 shadow-sm">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`rounded-full px-4 py-0 text-sm font-sans transition-all ${
                    activeCategory === cat.value
                      ? "bg-accent text-accent-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* ================= PRODUCT GRID ================= */}
          {products.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No products found.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl bg-card p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-4 flex h-56 items-center justify-center overflow-hidden rounded-xl bg-muted p-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    {product.name}
                  </h3>

                  <p className="mb-4 text-xs text-muted-foreground">
                    {product.description}
                  </p>

                  <p className="mb-4 text-sm font-bold text-green-600">
                    ₹{product.price}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBuyNow(product)}
                      className="flex-1 rounded-md border border-earthy-brown px-3 py-2 text-xs font-semibold text-black hover:bg-earthy-brown/10"
                    >
                      Buy Now
                    </button>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 rounded-md border border-earthy-brown px-3 py-2 text-xs font-semibold text-black hover:bg-earthy-brown/10"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
