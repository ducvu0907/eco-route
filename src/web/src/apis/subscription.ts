import { ApiResponse, SubscriptionCreateRequest, SubscriptionResponse, } from "@/types/types";
import axiosInstance from ".";

export const getSubscriptions = async (): Promise<ApiResponse<SubscriptionResponse[]>> => {
  const { data } = await axiosInstance.get("/subscriptions");
  return data;
};

export const createSubscription = async (payload: SubscriptionCreateRequest): Promise<ApiResponse<SubscriptionResponse>> => {
  const { data } = await axiosInstance.post("/subscriptions", payload);
  return data;
};
