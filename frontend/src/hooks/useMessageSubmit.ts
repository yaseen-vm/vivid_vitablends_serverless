import { useMutation } from "@tanstack/react-query";
import { messageApi } from "@/services/api/messageApi";
import { toast } from "sonner";

export const useMessageSubmit = () => {
  return useMutation({
    mutationFn: messageApi.create,
    onSuccess: () => {
      toast.success("Message sent successfully!");
    },
    onError: () => {
      toast.error("Failed to send message. Please try again.");
    },
  });
};
