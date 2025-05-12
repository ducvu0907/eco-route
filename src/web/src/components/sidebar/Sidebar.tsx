import { Home, Warehouse, Truck, Users, Send, ShoppingCart, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import UserSection from "./UserSection";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  key: string;
  path: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <Home className="w-4 h-4" />, key: "dashboard", path: "/dashboard" },
  { label: "Depots", icon: <Warehouse className="w-4 h-4" />, key: "depots", path: "/depots" },
  { label: "Vehicles", icon: <Truck className="w-4 h-4" />, key: "vehicles", path: "/vehicles" },
  { label: "Users", icon: <Users className="w-4 h-4" />, key: "users", path: "/users" },
  { label: "Dispatches", icon: <Send className="w-4 h-4" />, key: "dispatches", path: "/dispatches" },
  { label: "Orders", icon: <ShoppingCart className="w-4 h-4" />, key: "orders", path: "/orders" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Card className="h-screen w-64 border-r flex flex-col p-4 shadow-md">
      <div className="mb-6 text-2xl font-bold text-center">Manager Panel</div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.key}
              variant={isActive ? "default" : "ghost"}
              className={cn("justify-start gap-2", "text-black", isActive ? "bg-muted hover:text-white" : "hover:text-black")}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.label}
            </Button>
          );
        })}
      </nav>
      <UserSection />
    </Card>
  );
}
