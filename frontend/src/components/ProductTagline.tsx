const ProductTagline = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-emerald-950/20 dark:via-background dark:to-amber-950/20 py-24 px-6">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Main Heading */}
        <h2 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-emerald-300 dark:to-teal-400">
            Made with Love,
          </span>
          <br />
          <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent dark:from-amber-400 dark:via-orange-300 dark:to-amber-400">
            Crafted with Pride
          </span>
        </h2>

        {/* Description */}
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl">
          Pure ingredients, thoughtfully crafted into nourishing powders and
          traditional flavors.{" "}
          <span className="font-medium text-foreground">
            From smoothies to spices and pickles
          </span>
          , every product brings health and taste to your table.
        </p>

        {/* Decorative Divider */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-emerald-500/50" />
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <div className="h-px w-24 bg-gradient-to-r from-emerald-500/50 via-amber-500/50 to-emerald-500/50" />
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/50" />
        </div>
      </div>
    </section>
  );
};

export default ProductTagline;
