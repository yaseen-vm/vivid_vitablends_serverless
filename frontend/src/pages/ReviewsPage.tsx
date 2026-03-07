import { ArrowLeft, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useReviews } from "@/hooks/useReviews";
import { ReviewForm } from "@/components/ReviewForm";

const ReviewsPage = () => {
  const navigate = useNavigate();
  const { reviews, loading } = useReviews(false);

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-accent"
          >
            <ArrowLeft size={18} />
            Return to Home
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center mb-4">
          Customer Reviews
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Share your experience with our products
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <ReviewForm />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Recent Reviews</h2>
            {loading ? (
              <p className="text-muted-foreground">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg border p-4 bg-card"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{review.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
