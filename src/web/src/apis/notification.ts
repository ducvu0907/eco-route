import { ApiResponse, NotificationResponse } from "@/types/types";
import axiosInstance from ".";

export const readNotification = async (notificationId: string): Promise<ApiResponse<NotificationResponse>> => {
  const { data } = await axiosInstance.post(`/notifications/${notificationId}`);
  return data;
}