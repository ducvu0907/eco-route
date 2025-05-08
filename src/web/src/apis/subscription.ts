import { ApiResponse, SubscriptionCreateRequest, SubscriptionResponse, } from "@/types/types";
import axiosInstance from ".";

export const getSubscriptions = async (): Promise<ApiResponse<SubscriptionResponse[]>> => {
  const { data } = await axiosInstance.get("/subscriptions");
  return data;
};

export const getSubscriptionById = async (subscriptionId: string): Promise<ApiResponse<SubscriptionResponse>> => {
  const { data } = await axiosInstance.get(`/subscriptions/${subscriptionId}`);
  return data;
};

export const getSubscriptionByUserId = async (userId: string): Promise<ApiResponse<SubscriptionResponse>> => {
  const { data } = await axiosInstance.get(`/users/${userId}/subscription`);
  return data;
};

export const createSubscription = async (payload: SubscriptionCreateRequest): Promise<ApiResponse<SubscriptionResponse>> => {
  const { data } = await axiosInstance.post("/subscriptions", payload);
  return data;
};

export const deleteSubscription = async (subscriptionId: string): Promise<ApiResponse<void>> => {
  const { data } = await axiosInstance.delete(`/subscriptions/${subscriptionId}`);
  return data;
};
