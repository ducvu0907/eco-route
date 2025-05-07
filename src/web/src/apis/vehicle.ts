import { ApiResponse, VehicleResponse, VehicleCreateRequest, VehicleUpdateRequest, RouteResponse, } from "@/types/types";
import axiosInstance from ".";

export const getVehicles = async (): Promise<ApiResponse<VehicleResponse[]>> => {
  const { data } = await axiosInstance.get("/vehicles");
  return data;
};

export const createVehicle = async (payload: VehicleCreateRequest): Promise<ApiResponse<VehicleResponse>> => {
  const { data } = await axiosInstance.post("/vehicles", payload);
  return data;
};

export const updateVehicle = async (vehicleId: string, payload: VehicleUpdateRequest): Promise<ApiResponse<VehicleResponse>> => {
  const { data } = await axiosInstance.post(`/vehicles/${vehicleId}`, payload);
  return data;
};

export const getRoutesByVehicle = async (vehicleId: string): Promise<ApiResponse<RouteResponse[]>> => {
  const { data } = await axiosInstance.get(`/vehicles/${vehicleId}/routes`);
  return data;
};
