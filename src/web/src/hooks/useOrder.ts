import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getOrderById, createOrder, updateOrder, getOrderByUserId, } from "@/apis/order";
import { ApiResponse, OrderResponse, OrderCreateRequest, OrderUpdateRequest, } from "@/types/types";
import { useAuthContext } from "./useAuthContext";

export const useGetOrders = () => {
  return useQuery<ApiResponse<OrderResponse[]>>({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });
};

export const useGetOrdersByUserId = (userId: string) => {
  return useQuery<ApiResponse<OrderResponse[]>>({
    queryKey: ["users", userId, "orders"],
    queryFn: () => getOrderByUserId(userId),
  });
};

export const useGetOrderById = (orderId: string) => {
  return useQuery<ApiResponse<OrderResponse>>({
    queryKey: ["orders", orderId],
    queryFn: () => getOrderById(orderId),
  });
};

export const useCreateOrder = () => {
  const { userId } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OrderCreateRequest) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["users", userId, "orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  const { userId } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: OrderUpdateRequest }) =>
      updateOrder(orderId, payload),
    onSuccess: (_data, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      queryClient.invalidateQueries({ queryKey: ["users", userId, "orders"] });
    },
  });
};
