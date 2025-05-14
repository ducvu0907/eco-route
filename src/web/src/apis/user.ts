import { ApiResponse, UserResponse } from "@/types/types"
import axiosInstance from "."

export const getDriversNotAssigned = async (): Promise<ApiResponse<UserResponse[]>> => {
  const { data } = await axiosInstance.get("/drivers/not-assigned");
  return data;
}

export const getUsers = async (): Promise<ApiResponse<UserResponse[]>> => {
  const { data } = await axiosInstance.get("/users");
  return data;
}

export const getUserById = async (userId: string): Promise<ApiResponse<UserResponse>> => {
  const { data } = await axiosInstance.get(`/users/${userId}`);
  return data;
}
