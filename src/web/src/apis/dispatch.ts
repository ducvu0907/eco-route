import { ApiResponse, DispatchResponse } from "@/types/types";
import axiosInstance from ".";

export const getCurrentDispatch = async (): Promise<ApiResponse<DispatchResponse>> => {
  const { data } = await axiosInstance.get("/dispatches/current");
  return data;
}

export const getDispatches = async (): Promise<ApiResponse<DispatchResponse[]>> => {
  const { data } = await axiosInstance.get("/dispatches");
  return data;
}

export const createDispatch = async (): Promise<ApiResponse<void>> => {
  const { data } = await axiosInstance.post("/dispatches");
  return data;
}