import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getOrderById, createOrder, updateOrder, getOrderByUserId, getPendingOrders, getOngoingOrders, markOrderAsDone, markOrderAsCancelled, } from "@/apis/order";
import { ApiResponse, OrderResponse, OrderCreateRequest, OrderUpdateRequest, } from "@/types/types";
import { useToast } from "./useToast";

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
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, file }: { payload: OrderCreateRequest, file: any}) => createOrder(payload, file),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      showToast(response.message, "success");
    },
  });
};

export const useUpdateOrder = () => {
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload: OrderUpdateRequest }) =>
      updateOrder(orderId, payload),
    onSuccess: (response, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      showToast(response.message, "success");
    },
  });
};

export const useMarkOrderAsDone = () => {
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => markOrderAsDone(orderId),
    onSuccess: (response, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      showToast(response.message, "success");
    }
  })
}

export const useMarkOrderAsCancelled = () => {
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => markOrderAsCancelled(orderId),
    onSuccess: (response, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      showToast(response.message, "success");
    }
  })
}
