import { ApiResponse, DepotResponse, DepotCreateRequest } from "@/types/types";
import axiosInstance from ".";

export const getDepots = async (): Promise<ApiResponse<DepotResponse[]>> => {
  const { data } = await axiosInstance.get("/depots");
  return data;
};

export const getDepotById = async (depotId: string): Promise<ApiResponse<DepotResponse>> => {
  const { data } = await axiosInstance.get(`/depots/${depotId}`);
  return data;
};

export const updateDepot = async (depotId: string, payload: DepotCreateRequest): Promise<ApiResponse<DepotResponse>> => {
  const { data } = await axiosInstance.post(`/depots/${depotId}`, payload);
  return data;
};

export const createDepot = async (payload: DepotCreateRequest): Promise<ApiResponse<DepotResponse>> => {
  const { data } = await axiosInstance.post("/depots", payload);
  return data;
};

export const deleteDepot = async (depotId: string): Promise<ApiResponse<DepotResponse>> => {
  const { data } = await axiosInstance.delete(`/depots/${depotId}`);
  return data;
};
