import { ApiResponse, OrderResponse, OrderCreateRequest, OrderUpdateRequest, } from "@/types/types";
import axiosInstance from ".";

export const getOngoingOrders = async (): Promise<ApiResponse<OrderResponse[]>> => {
  const { data } = await axiosInstance.get("/orders/in-progress");
  return data;
};

export const getPendingOrders = async (): Promise<ApiResponse<OrderResponse[]>> => {
  const { data } = await axiosInstance.get("/orders/pending");
  return data;
};

export const getOrders = async (): Promise<ApiResponse<OrderResponse[]>> => {
  const { data } = await axiosInstance.get("/orders");
  return data;
};

export const getOrderById = async (orderId: string): Promise<ApiResponse<OrderResponse>> => {
  const { data } = await axiosInstance.get(`/orders/${orderId}`);
  return data;
};

export const getOrderByUserId = async (userId: string): Promise<ApiResponse<OrderResponse[]>> => {
  const { data } = await axiosInstance.get(`/users/${userId}/orders`);
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
