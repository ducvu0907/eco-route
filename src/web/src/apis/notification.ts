import { ApiResponse, NotificationResponse } from "@/types/types";
import axiosInstance from ".";

export const getNotificationsByUserId = async (userId: string): Promise<ApiResponse<NotificationResponse[]>> => {
  const { data } = await axiosInstance.get(`/users/${userId}/notifications`);
  return data;
}
