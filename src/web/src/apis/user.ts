import { ApiResponse, NotificationResponse, Role, UserResponse } from "@/types/types"
import axiosInstance from "."

export const getUsers = async (role?: Role): Promise<ApiResponse<UserResponse[]>> => {
  const { data } = await axiosInstance.get("/users", {
    params: role ? { role } : {},
  });
  return data;
}

export const getUser = async (userId: string): Promise<ApiResponse<UserResponse>> => {
  const { data } = await axiosInstance.get(`/users/${userId}`);
  return data;
}

export const getNotificationsByUser = async (userId: string): Promise<ApiResponse<NotificationResponse[]>> => {
  const { data } = await axiosInstance.get(`/users/${userId}/notifications`);
  return data;
}
