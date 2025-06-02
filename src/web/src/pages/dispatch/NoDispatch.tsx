import { useCreateDispatch } from "@/hooks/useDispatch";
import PendingOrdersMap from "@/components/dispatch/PendingOrdersMap";
import PendingOrdersSidebar from "@/components/dispatch/PendingOrdersSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Zap } from "lucide-react";
import { useGetPendingOrders } from "@/hooks/useOrder";
import { useGetVehicles } from "@/hooks/useVehicle";
import { useState } from "react";
import { TrashCategory } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export default function NoDispatch() {
  const queryClient = useQueryClient();
  const { mutate: createDispatch, isPending } = useCreateDispatch();
  const { data: orderData } = useGetPendingOrders();
  const { data: vehicleData } = useGetVehicles();
  const { t } = useTranslation();

  const orders = orderData?.result || [];
  const vehicles = vehicleData?.result || [];
  const totalWeight = orders.reduce((sum, order) => sum + order.weight, 0);
  const [filterCategory, setFilterCategory] = useState<TrashCategory | "ALL">("ALL");

  // Filter orders by category
  const filteredOrders = filterCategory === "ALL"
    ? orders
    : orders.filter(order => order.category === filterCategory);

  const onSubmit = () => {
    createDispatch(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["orders", "pending"]});
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header Stats */}
      <div className="p-6 border-b bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{t("noDispatch.header.title")}</h1>
            <p className="text-muted-foreground">{t("noDispatch.header.subtitle")}</p>
          </div>
          <Button
            onClick={onSubmit}
            disabled={isPending || orders.length === 0}
            size="lg"
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            {isPending ? t("noDispatch.header.creatingButton") : t("noDispatch.header.createButton")}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("noDispatch.stats.pendingOrders")}</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("noDispatch.stats.availableVehicles")}</p>
                  <p className="text-2xl font-bold">{vehicles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("noDispatch.stats.totalWeight")}</p>
                  <p className="text-2xl font-bold">{totalWeight}{t("noDispatch.stats.weightUnit")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter badges */}
      <div className="flex flex-wrap gap-2 m-2">
        <Badge
          variant={filterCategory === "ALL" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setFilterCategory("ALL")}
        >
          {t("noDispatch.filters.all")}
        </Badge>
        {Object.values(TrashCategory).map((category) => (
          <Badge
            variant={filterCategory === category ? "default" : "outline"}
            key={category}
            className="cursor-pointer"
            onClick={() => setFilterCategory(category)}
          >
            {t(`noDispatch.filters.category.${category.toLowerCase()}`)}
          </Badge>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map - Left Side */}
        <div className="w-2/3 overflow-auto">
          <PendingOrdersMap orders={filteredOrders}/>
        </div>

        {/* Sidebar - Right Side */}
        <div className="w-1/3 overflow-auto">
          <PendingOrdersSidebar orders={filteredOrders}/>
        </div>
      </div>
    </div>
  );
}