import { useMutation } from "@tanstack/react-query";
import { reviewApi } from "@/services/api/reviewApi";
import { toast } from "sonner";

export const useReviewSubmit = () => {
  return useMutation({
    mutationFn: reviewApi.create,
    onSuccess: () => {
      toast.success("Thank you for your review!");
    },
    onError: () => {
      toast.error("Failed to submit review. Please try again.");
    },
  });
};
