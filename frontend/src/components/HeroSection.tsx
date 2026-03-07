import banner1 from "@/assets/banner1.png";
import banner1mob from "@/assets/banner1mob.png";
import product from "@/assets/koorka.jpg"; // your product image
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Launching Soon Badge */}
      <div className="absolute top-3 right-3 md:top-6 md:right-6 z-30 w-[90px] h-[90px] md:w-[120px] md:h-[120px]">
        {/* Rotating Text */}
        <div className="absolute inset-0 animate-rotate-badge">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <path
                id="circle"
                d="
                  M 50,50
                  m -38,0
                  a 38,38 0 1,1 76,0
                  a 38,38 0 1,1 -76,0
                "
              />
            </defs>

            <text
              fill="#fbbf24"
              fontSize="8"
              fontWeight="bold"
              letterSpacing="2"
            >
              <textPath href="#circle">
                • LAUNCHING SOON • VIVID VITABLENDS •
              </textPath>
            </text>
          </svg>
        </div>

        {/* Center Product */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={product}
            alt="Launching product"
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>

      <div className="relative h-[80vh] min-h-[500px] md:h-[90vh]">
        {/* Background Images */}
        <>
          <img
            src={banner1mob}
            alt="Vivid Vitablends premium homemade food products"
            className="absolute inset-0 w-full h-full object-cover object-top md:hidden"
            loading="eager"
          />

          <img
            src={banner1}
            alt="Vivid Vitablends premium homemade food products"
            className="absolute inset-0 hidden md:block w-full h-[900px] object-cover object-center"
            loading="eager"
          />
        </>

        {/* Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
            <div className="max-w-lg animate-fade-up">
              <p className="mb-12 text-base md:text-xl font-semibold uppercase tracking-[0.2em] text-warm-gold text-left">
                No Preservatives,
                <br />
                Just Real Ingredients
              </p>

              <h1 className="mb-12 font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl lg:text-7xl">
                Pure. Natural.{" "}
                <span className="text-warm-gold text-3xl md:text-5xl lg:text-6xl">
                  Crafted with Care.
                </span>
              </h1>

              <p className="mb-12 text-lg text-primary-foreground/80">
                Pickles, wellness blends & everyday essentials
              </p>

              <div className="flex gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center rounded-lg bg-accent px-8 py-3.5 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 hover:shadow-lg"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
