import { ApiResponse, OrderResponse, OrderCreateRequest, OrderUpdateRequest, } from "@/types/types";
import axiosInstance from ".";

export const getOrders = async (userId?: string): Promise<ApiResponse<OrderResponse[]>> => {
  const { data } = await axiosInstance.get("/orders", {
    params: userId ? { userId } : undefined,
  });
  return data;
};

export const getOrder = async (orderId: string): Promise<ApiResponse<OrderResponse>> => {
  const { data } = await axiosInstance.get(`/orders/${orderId}`);
  return data;
};

export const createOrder = async (payload: OrderCreateRequest): Promise<ApiResponse<OrderResponse>> => {
  const { data } = await axiosInstance.post("/orders", payload);
  return data;
};

export const updateOrder = async (orderId: string, payload: OrderUpdateRequest): Promise<ApiResponse<OrderResponse>> => {
  const { data } = await axiosInstance.post(`/orders/${orderId}`, payload);
  return data;
};
