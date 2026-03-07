import { useRef, useEffect } from "react";
import advideo from "@/assets/videos/ad.mp4";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VideoSection = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const dividerRef = useRef(null);
  const paraRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 40%",
        toggleActions: "play none none none",
      },
    });

    gsap.from(videoRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 20%",
      },
    });

    tl.from(labelRef.current, {
      scale: 0.6,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
    })
      .from(
        headingRef.current,
        {
          scale: 0.7,
          opacity: 0,
          duration: 0.7,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      )
      .from(
        dividerRef.current,
        {
          scaleX: 0,
          opacity: 0,
          duration: 0.5,
          transformOrigin: "left",
        },
        "-=0.2"
      )
      .from(
        paraRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
        },
        "-=0.2"
      );
  }, []);

  return (
    <section ref={sectionRef} id="about" className="section-padding">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* VIDEO */}
          <div className="relative">
            <div
              ref={videoRef}
              className="overflow-hidden rounded-2xl border-2 border-amber-400 shadow-xl"
            >
              <video
                src={advideo}
                autoPlay
                loop
                muted
                playsInline
                aria-label="Product showcase video"
                className="w-full h-[220px] md:h-[320px] lg:h-[500px] object-cover"
              />
            </div>
          </div>

          {/* CONTENT */}
          <div className="text-center lg:text-left">
            <p
              ref={labelRef}
              className="text-sm font-semibold tracking-[0.35em] text-accent uppercase"
            >
              Products are
            </p>

            <h2
              ref={headingRef}
              className="mt-4 font-display text-4xl lg:text-5xl font-semibold text-foreground leading-tight"
            >
              Made with Love,
              <br />
              Crafted with Pride
            </h2>

            <div
              ref={dividerRef}
              className="w-16 h-[3px] bg-amber-500 mt-6 mb-6"
            ></div>

            <p
              ref={paraRef}
              className="max-w-xl text-muted-foreground text-lg leading-relaxed tracking-wide"
            >
              Pure ingredients, thoughtfully crafted into nourishing powders and
              traditional flavors. From smoothies to spices and pickles, every
              product brings health and taste to your table.
            </p>

            <div className="mt-8 flex flex-col lg:flex-row lg:items-center gap-6">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition">
                SHOP NOW →
              </button>

              <div className="flex gap-8 text-sm text-muted-foreground">
                <div>
                  🌿 <span className="ml-1">100% Natural</span>
                </div>

                <div>
                  🛡 <span className="ml-1">Preservative Free</span>
                </div>

                <div>
                  🏺 <span className="ml-1">Authentic Kerala Taste</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
