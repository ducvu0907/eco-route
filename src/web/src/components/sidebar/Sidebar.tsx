import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLogout } from "@/hooks/useAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Globe, Home, LogOut, MapIcon, Send, ShoppingCart, Truck, Users, Warehouse, Waypoints } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationDropdown from "../notification/NotificationDropdown";

type NavItem = {
  labelKey: string;
  icon: React.ReactNode;
  key: string;
  path: string;
};

function UserSection({ isCollapsed }: { isCollapsed: boolean }) {
  const { username } = useAuthContext();
  const { logout } = useLogout();
  const { t, i18n } = useTranslation();

  if (!username) {
    return (
      <div>
        <span>{t("sidebar.userSection.usernameError")}</span>
      </div>
    );
  }

  const getInitials = (name?: string) => {
    if (!name) return t("sidebar.userSection.userAvatarFallback");
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleChangeLanguage = () => i18n.language == "en" ? i18n.changeLanguage("vi") : i18n.changeLanguage("en");

  if (isCollapsed) {
    return (
      <div className="space-y-3">
        <Separator />
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-medium bg-muted">
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
          <NotificationDropdown />
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 hover:bg-muted"
            onClick={logout}
            title={t("sidebar.userSection.signOut")}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Separator />
      
      <Card className="p-3 bg-muted/50 border-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-medium bg-background">
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 flex flex-row items-center justify-between">
            <p className="text-sm font-medium truncate">
              {username}
            </p>
          </div>
          <Globe className="w-5 h-5" onClick={handleChangeLanguage}/>
          <NotificationDropdown />
        </div>
      </Card>

      <Button
        variant="ghost"
        className="w-full justify-start gap-3 px-3 py-2 text-sm hover:bg-muted"
        onClick={logout}
      >
        <LogOut className="w-4 h-4" />
        {t("sidebar.userSection.signOut")}
      </Button>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    { labelKey: "dashboard", icon: <Home className="w-5 h-5" />, key: "dashboard", path: "/dashboard" },
    { labelKey: "depots", icon: <Warehouse className="w-5 h-5" />, key: "depots", path: "/depots" },
    { labelKey: "vehicles", icon: <Truck className="w-5 h-5" />, key: "vehicles", path: "/vehicles" },
    { labelKey: "users", icon: <Users className="w-5 h-5" />, key: "users", path: "/users" },
    { labelKey: "dispatches", icon: <Send className="w-5 h-5" />, key: "dispatches", path: "/dispatches" },
    { labelKey: "orders", icon: <ShoppingCart className="w-5 h-5" />, key: "orders", path: "/orders" },
    { labelKey: "map", icon: <MapIcon className="w-5 h-5" />, key: "map", path: "/map" },
  ];

  return (
    <div className={cn(
      "h-screen bg-background border-r flex flex-col transition-all duration-100",
      isCollapsed ? "w-16" : "w-60"
    )}>
      {/* Header Section */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Waypoints className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                {/* Potentially add a logo or app name here, if not just icons */}
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 hover:bg-muted ml-auto"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.key}
              variant="ghost"
              className={cn(
                "w-full text-sm font-medium transition-colors",
                isCollapsed ? "justify-center px-0 h-10" : "justify-start gap-3 px-3 h-10",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/70"
                  : "hover:bg-muted"
              )}
              onClick={() => navigate(item.path)}
              title={isCollapsed ? t(`sidebar.nav.${item.labelKey}`) : undefined} // Translated title
            >
              {item.icon}
              {!isCollapsed && <span>{t(`sidebar.nav.${item.labelKey}`)}</span>} {/* Translated label */}
            </Button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t">
        {/* User Section */}
        <UserSection isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}
