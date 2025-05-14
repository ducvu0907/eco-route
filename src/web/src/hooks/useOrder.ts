import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getOrderById, createOrder, updateOrder, getOrderByUserId, getPendingOrders, getOngoingOrders, } from "@/apis/order";
import { ApiResponse, OrderResponse, OrderCreateRequest, OrderUpdateRequest, } from "@/types/types";

export const useGetOngoingOrders = () => {
  return useQuery<ApiResponse<OrderResponse[]>>({
    queryKey: ["orders", "in-progress"],
    queryFn: () => getOngoingOrders(),
  });
};

export const useGetPendingOrders = () => {
  return useQuery<ApiResponse<OrderResponse[]>>({
    queryKey: ["orders", "pending"],
    queryFn: () => getPendingOrders(),
  });
};

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
    enabled: !!userId
  });
};

export const useGetOrderById = (orderId: string) => {
  return useQuery<ApiResponse<OrderResponse>>({
    queryKey: ["orders", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OrderCreateRequest) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: OrderUpdateRequest }) =>
      updateOrder(orderId, payload),
    onSuccess: (_data, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
    },
  });
};
