import { useQuery } from "@tanstack/react-query";
import { getNotificationsByUserId } from "@/apis/notification";
import { ApiResponse, NotificationResponse } from "@/types/types";

export const useGetNotificationsByUserId = (userId: string) => {
  return useQuery<ApiResponse<NotificationResponse[]>>({
    queryKey: ["users", userId, "notifications"],
    queryFn: () => getNotificationsByUserId(userId),
    enabled: !!userId
  });
}
