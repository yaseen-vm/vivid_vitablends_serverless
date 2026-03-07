import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReviewSubmit } from "@/hooks/useReviewSubmit";

const reviewSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  rating: z
    .number()
    .int()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .min(1, "Comment is required")
    .max(1000, "Comment must not exceed 1000 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export const ReviewForm = () => {
  const mutation = useReviewSubmit();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: "",
      rating: 0,
      comment: "",
    },
  });

  const rating = form.watch("rating");

  const onSubmit = (data: ReviewFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="Your Name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer transition ${
                    star <= (rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() =>
                    form.setValue("rating", star, { shouldValidate: true })
                  }
                />
              ))}
            </div>
            {form.formState.errors.rating && (
              <p className="text-sm text-red-500">
                {form.formState.errors.rating.message}
              </p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Your Review"
              rows={4}
              {...form.register("comment")}
            />
            {form.formState.errors.comment && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.comment.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
