import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotificationsByUserId, readNotification } from "@/apis/notification";
import { ApiResponse, NotificationResponse } from "@/types/types";

export const useGetNotificationsByUserId = (userId: string) => {
  return useQuery<ApiResponse<NotificationResponse[]>>({
    queryKey: ["notifications"],
    queryFn: () => getNotificationsByUserId(userId),
    enabled: !!userId
  });
}

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => readNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["notifications"]});
    }
  });
}