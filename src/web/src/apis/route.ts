import { ApiResponse, RouteResponse } from "@/types/types"
import axiosInstance from "."

export const getRouteById = async (routeId: string): Promise<ApiResponse<RouteResponse>> => {
  const { data } = await axiosInstance.get(`/routes/${routeId}`);
  return data;
}

export const getVehicleCurrentRoute = async (vehicleId: string): Promise<ApiResponse<RouteResponse>> => {
  const { data } = await axiosInstance.get(`/vehicles/${vehicleId}/routes/current`);
  return data;
}

export const getRoutesByVehicleId = async (vehicleId: string): Promise<ApiResponse<RouteResponse[]>> => {
  const { data } = await axiosInstance.get(`/vehicles/${vehicleId}/routes`);
  return data;
}

export const getRoutesByDispatchId = async (dispatchId: string): Promise<ApiResponse<RouteResponse[]>> => {
  const { data } = await axiosInstance.get(`/dispatches/${dispatchId}/routes`);
  return data;
}

export const markRouteAsDone = async (routeId: string): Promise<ApiResponse<RouteResponse[]>> => {
  const { data } = await axiosInstance.get(`/routes/${routeId}/done`);
  return data;
}