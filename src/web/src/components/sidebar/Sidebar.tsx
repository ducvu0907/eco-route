import { Home, Warehouse, Truck, Users, Send, ShoppingCart, Map, LogOut, ChevronLeft, ChevronRight, Waypoints, Bell, Dot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import React from "react";
import NotificationDropdown from "../notification/NotificationDropdown";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  key: string;
  path: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <Home className="w-5 h-5" />, key: "dashboard", path: "/dashboard" },
  { label: "Depots", icon: <Warehouse className="w-5 h-5" />, key: "depots", path: "/depots" },
  { label: "Vehicles", icon: <Truck className="w-5 h-5" />, key: "vehicles", path: "/vehicles" },
  { label: "Users", icon: <Users className="w-5 h-5" />, key: "users", path: "/users" },
  { label: "Dispatches", icon: <Send className="w-5 h-5" />, key: "dispatches", path: "/dispatches" },
  { label: "Orders", icon: <ShoppingCart className="w-5 h-5" />, key: "orders", path: "/orders" },
];

function UserSection({ isCollapsed }: { isCollapsed: boolean }) {
  const { username } = useAuthContext();
  const { logout } = useLogout();

  if (!username) {
    return (
      <div>
        <span>Error while retrieving username</span>
      </div>
    );
  }

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 hover:bg-muted"
            onClick={logout}
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
          <NotificationDropdown />
        </div>
      </Card>

      <Button
        variant="ghost"
        className="w-full justify-start gap-3 px-3 py-2 text-sm hover:bg-muted"
        onClick={logout}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "h-screen bg-background border-r flex flex-col transition-all duration-500",
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
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 hover:bg-muted ml-auto"
            onClick={() => setIsCollapsed(!isCollapsed)}
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
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t">
        <UserSection isCollapsed={isCollapsed} />
      </div>
    </div>
  );
}