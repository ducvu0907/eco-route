import { NotificationResponse, NotificationType } from "@/types/types";

export const notificationRoute = (notification: NotificationResponse) => {
  switch (notification.type) {
    case NotificationType.ORDER:
      return `/orders/${notification.refId}`;
    case NotificationType.ROUTE:
      return `/routes/${notification.refId}`;
    case NotificationType.ORDER:
      return `/dispatches/${notification.refId}`;
    default:
      return '/';
  }
}