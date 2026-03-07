import storyImage from "@/assets/hero-banner.jpg";

const StorylineSection = () => {
  return (
    <section className="relative section-padding overflow-hidden bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-background">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-orange-200/15 to-amber-200/15 rounded-full blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid items-center gap-16 md:grid-cols-2 lg:gap-20">
          {/* ================= IMAGE ================= */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500" />
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={storyImage}
                alt="Traditional homemade preparation"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
            </div>
          </div>

          {/* ================= TEXT ================= */}
          <div className="text-center md:text-left space-y-8">
            <div className="space-y-4">
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 bg-clip-text text-transparent">
                  Food the way
                </span>
                <br />
                <span className="text-foreground">it was meant to be</span>
              </h2>
            </div>

            <div className="space-y-6 text-lg md:text-xl leading-relaxed">
              <p className="font-medium text-muted-foreground/90">
                In a world full of{" "}
                <span className="text-orange-600 font-semibold">
                  preservatives
                </span>
                ,{" "}
                <span className="text-orange-600 font-semibold">shortcuts</span>
                , and{" "}
                <span className="text-orange-600 font-semibold">
                  artificial flavors
                </span>
                , we chose a different path.
              </p>

              <p className="text-muted-foreground/80">
                Every pickle we prepare, every wellness blend we craft, begins
                with{" "}
                <span className="font-semibold text-amber-700">
                  real ingredients
                </span>
                ,{" "}
                <span className="font-semibold text-amber-700">
                  slow processes
                </span>
                , and{" "}
                <span className="font-semibold text-amber-700">
                  generations of tradition
                </span>
                .
              </p>

              <div className="pt-4">
                <p className="text-2xl md:text-3xl font-display font-semibold bg-gradient-to-r from-amber-800 via-orange-700 to-amber-800 bg-clip-text text-transparent leading-snug">
                  Because good food doesn't just fill you <br></br>- it cares
                  for you.
                </p>
              </div>
            </div>

            {/* Decorative Line */}
            <div className="flex items-center gap-3 pt-4">
              <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
              <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorylineSection;
