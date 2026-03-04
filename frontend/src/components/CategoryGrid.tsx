import { useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/types/Category";
import categoryPickles from "@/assets/category-pickles.jpg";
import categoryPowders from "@/assets/category-powders.jpg";

const getCategoryImage = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("pickle")) return categoryPickles;
  if (name.includes("powder") || name.includes("health"))
    return categoryPowders;
  return categoryPickles;
};

const getCategoryDescription = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("pickle")) return "Traditional recipes, bold flavors";
  if (name.includes("powder") || name.includes("health"))
    return "Nature's goodness, powdered";
  if (name.includes("combo")) return "Bundle deals & savings";
  return "Discover our collection";
};

const CategoryGrid = () => {
  const navigate = useNavigate();
  const { displayCategories: categories, loading } = useCategories();

  const handleCategoryClick = (category: Category) => {
    navigate(
      `/products?category=${encodeURIComponent(category.name.toLowerCase())}`
    );
  };

  if (loading) {
    return (
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-[220px] md:h-[450px] animate-pulse bg-gray-200 rounded-xl"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl">
        <div
          className={`grid gap-4 ${
            categories.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : categories.length === 2
                ? "grid-cols-2"
                : "grid-cols-2 md:grid-cols-3"
          }`}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="group relative h-[220px] md:h-[450px] overflow-hidden rounded-xl text-left"
            >
              <img
                src={getCategoryImage(category.name)}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-all group-hover:from-black/80" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 p-4 md:p-8">
                <h2 className="font-display text-lg font-bold text-white md:text-4xl capitalize">
                  {category.name}
                </h2>

                <p className="mt-1 text-xs text-white/80 md:text-sm">
                  {getCategoryDescription(category.name)}
                </p>

                <span className="mt-2 inline-block text-xs font-semibold text-warm-gold transition-transform group-hover:translate-x-2 md:text-sm">
                  Explore →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
