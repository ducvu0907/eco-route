import { ApiResponse, VehicleCreateRequest, VehicleResponse, VehicleUpdateRequest } from "@/types/types";
import axiosInstance from ".";

export const getVehicles = async (): Promise<ApiResponse<VehicleResponse[]>> => {
  const { data } = await axiosInstance.get("/vehicles");
  return data;
};

export const getVehicleById = async (vehicleId: string): Promise<ApiResponse<VehicleResponse>> => {
  const { data } = await axiosInstance.get(`/vehicles/${vehicleId}`);
  return data;
};

export const getVehicleByDriverId = async (driverId: string): Promise<ApiResponse<VehicleResponse>> => {
  const { data } = await axiosInstance.get(`/users/${driverId}/vehicle`);
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
