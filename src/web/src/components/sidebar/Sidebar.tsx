import { Home, Warehouse, Truck, Users, Send, ShoppingCart, Map, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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
  { label: "Map", icon: <Map className="w-5 h-5" />, key: "map", path: "/map" },
];

function UserSection() {
  const { username } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className="space-y-4">
      <Separator className="bg-border/50" />
      
      {/* User Profile Card */}
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-primary/30 shadow-md">
              <AvatarImage
                src={"https://github.com/shadcn.png"}
                alt={"user avatar"}
                className="rounded-full"
              />
              <AvatarFallback className="text-lg font-bold bg-primary/20 text-primary">
                {username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-pulse"></div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {username}
            </p>
            <p className="text-xs text-muted-foreground">
              Online
            </p>
          </div>
        </div>
      </Card>

      {/* Logout Button */}
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
        onClick={logout}
      >
        <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
        Sign Out
      </Button>
    </div>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-screen w-60 bg-gradient-to-br from-background via-background to-muted/30 border-r border-border/50 flex flex-col shadow-2xl">
      {/* Header Section */}
      <div className="p-6 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
            <Truck className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              WasteFlow
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Management System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <div className="pb-4">
          <h2 className="mb-3 px-4 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
            Navigation
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.key}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transform hover:scale-[1.02]"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground hover:shadow-md hover:transform hover:scale-[1.01]"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r-full"></div>
                  )}
                  
                  <div className={cn(
                    "transition-all duration-300 group-hover:scale-110",
                    isActive && "drop-shadow-sm"
                  )}>
                    {item.icon}
                  </div>
                  <span className="font-medium">
                    {item.label}
                  </span>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 mt-auto">
        <UserSection />
      </div>
    </div>
  );
}