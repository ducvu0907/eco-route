import { useState, useRef, useEffect } from "react";
import { Bell, Dot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetNotificationsByUserId } from "@/hooks/useNotification";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/formatDate";
import { useTranslation } from "react-i18next";

export default function NotificationDropdown() {
  const { t } = useTranslation();
  const { userId } = useAuthContext();
  const { data, isLoading } = useGetNotificationsByUserId(userId as string);

  const notifications = data?.result || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen((prev) => !prev)}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-destructive text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="max-h-[500px] absolute left-10 bottom-10 mt-2 w-80 bg-white dark:bg-zinc-900 shadow-lg rounded-md border z-50 overflow-auto">
          <div className="p-3 border-b text-sm font-semibold">
            {t("notificationDropdown.title")}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 flex items-center justify-center text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t("notificationDropdown.loading")}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-muted-foreground text-sm">
                {t("notificationDropdown.empty")}
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-2 p-3 text-sm hover:bg-muted cursor-pointer",
                    !notification.isRead && "bg-muted/30"
                  )}
                >
                  {!notification.isRead && (
                    <Dot className="text-primary mt-1 w-4 h-4" />
                  )}
                  <div className="flex-1">
                    <p>{notification.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
