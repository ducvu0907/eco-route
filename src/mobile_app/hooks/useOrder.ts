import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, getOrderById, createOrder, updateOrder, getOrderByUserId, getPendingOrders, getOngoingOrders, markOrderAsCompleted, markOrderAsCancelled, markOrderAsReassigned } from "@/apis/order";
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
    mutationFn: ({ payload, file }: { payload: OrderCreateRequest, file?: any}) => createOrder(payload, file),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["users", _data.result?.userId, "orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, payload, file }: { orderId: string; payload: OrderUpdateRequest, file?: any }) =>
      updateOrder(orderId, payload, file),
    onSuccess: (_data, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["users", _data.result?.userId, "orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
    },
  });
};

export const useMarkOrderAsDone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => markOrderAsCompleted(orderId),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["users", _data.result?.userId, "orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
    }
  })
}

export const useMarkOrderAsCancelled = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => markOrderAsCancelled(orderId),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["users", _data.result?.userId, "orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  })
}

export const useMarkOrderAsReassigned = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => markOrderAsReassigned(orderId),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
    }
  })
}
