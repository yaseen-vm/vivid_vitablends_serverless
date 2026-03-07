import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReviews } from "@/hooks/useReviews";
import { Button } from "@/components/ui/button";

const ReviewsSection = () => {
  const { reviews: homepageReviews, loading } = useReviews(true);
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);

  const isMobile = window.innerWidth < 768;
  const itemsPerView = isMobile ? 1 : 3;

  // Auto Slide
  useEffect(() => {
    if (homepageReviews.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setIndex((prev) =>
        prev + itemsPerView >= homepageReviews.length ? 0 : prev + itemsPerView
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [homepageReviews.length, itemsPerView]);

  if (loading) return null;
  if (homepageReviews.length === 0) return null;

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-accent">
            What Our Customers Say
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
            Customer Reviews
          </h2>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/reviews")}
          >
            Leave a Review
          </Button>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${index * (100 / itemsPerView)}%)`,
            }}
          >
            {homepageReviews.map((review) => (
              <div
                key={review.id}
                className={`w-full md:w-1/3 flex-shrink-0 px-4`}
              >
                <div className="rounded-2xl bg-card p-6 shadow-sm transition hover:shadow-lg h-full">
                  {/* Stars */}
                  <div className="mb-4 flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    "{review.comment}"
                  </p>

                  <p className="mt-4 font-semibold text-foreground">
                    — {review.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
