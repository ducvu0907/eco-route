import { ApiResponse, DispatchResponse } from "@/types/types";
import axiosInstance from ".";

export const getDispatches = async (): Promise<ApiResponse<DispatchResponse[]>> => {
  const { data } = await axiosInstance.get("/dispatches");
  return data;
}