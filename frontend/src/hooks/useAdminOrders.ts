import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/services/api/orderApi";
import { authStorage } from "@/lib/storage";
import { toast } from "sonner";

export const useAdminOrders = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => orderApi.getAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update order status");
    },
  });

  return {
    orders: Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [],
    loading: isLoading,
    error,
    refetch,
    updateStatus: (id: string, status: string) =>
      updateStatusMutation.mutate({ id, status }),
  };
};
