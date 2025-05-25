import { Home, Warehouse, Truck, Users, Send, ShoppingCart, Map } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import UserSection from "./UserSection"; // Assuming this component exists and is styled appropriately

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
  { label: "Map", icon: <Map className="w-4 h-4" />, key: "map", path: "/map" }, // Changed MapIcon to Map for a potentially cleaner look
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Card className="h-screen w-64 border-r flex flex-col p-4 shadow-xl bg-background">
      <div className="mb-8 mt-2 text-3xl font-extrabold text-center text-primary tracking-tight">

      </div>
      <nav className="flex flex-col flex-grow gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.key}
              variant="ghost" // Use ghost variant as base
              className={cn(
                "justify-start gap-3 px-4 py-2 text-base font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.label}
            </Button>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-border">
        <UserSection />
      </div>
    </Card>
  );
}
