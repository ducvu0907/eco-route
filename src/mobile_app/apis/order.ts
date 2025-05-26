import { ApiResponse, OrderResponse, OrderCreateRequest, OrderUpdateRequest, } from "@/types/types";
import axiosInstance from ".";

export const markOrderAsCancelled = async (orderId: string): Promise<ApiResponse<OrderResponse>> => {
  const { data } = await axiosInstance.post(`/orders/${orderId}/cancelled`);
  return data;
};

export const markOrderAsDone = async (orderId: string): Promise<ApiResponse<OrderResponse>> => {
  const { data } = await axiosInstance.post(`/orders/${orderId}/done`);
  return data;
};

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

export const createOrder = async (payload: OrderCreateRequest, file?: {uri: string, name: string, type: string}): Promise<ApiResponse<OrderResponse>> => {
  console.log(payload, file);

  const formData = new FormData();

  formData.append("request", {
    "string": JSON.stringify(payload),
    type: "application/json"
  } as any);

  if (file) {
    formData.append("file", file as any);
  }

  const { data } = await axiosInstance.post("/orders", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });

  return data;
};

export const updateOrder = async (orderId: string, payload: OrderUpdateRequest): Promise<ApiResponse<OrderResponse>> => {
  const { data } = await axiosInstance.post(`/orders/${orderId}`, payload);
  return data;
};
