import { useCreateDispatch, useGetCurrentDispatch } from "@/hooks/useDispatch";
import { useGetPendingOrders } from "@/hooks/useOrder";
import { useGetRoutesByDispatchId } from "@/hooks/useRoute";
import MultiRoutesDynamicMap from "@/components/map/MultiRoutesDynamicMap";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import NoDispatch from "./NoDispatch";

export default function CurrentDispatchDetails() {
  const {mutate: createDispatch, isPending} = useCreateDispatch();
  const [tab, setTab] = useState("routes");

  const {
    data: dispatchData,
    isLoading: isDispatchLoading,
    isError: isDispatchError,
  } = useGetCurrentDispatch();

  const dispatch = dispatchData?.result;

  // fallback
  const {
    data: routesData,
    isLoading: isRoutesLoading,
    isError: isRoutesError,
  } = useGetRoutesByDispatchId(dispatch?.id || "");

  const {
    data: pendingOrdersData,
    isLoading: isPendingLoading,
    isError: isPendingError,
  } = useGetPendingOrders();

  const routes = routesData?.result || [];
  const pendingOrders = pendingOrdersData?.result || [];

  const isLoading = isDispatchLoading || isRoutesLoading || isPendingLoading;
  const isError = isDispatchError || isRoutesError || isPendingError;

  if (!dispatch) {
    return <NoDispatch />;
  }

  if (isLoading) {
    return (
      <div className="p-6 flex gap-6">
        <Skeleton className="h-[80vh] w-2/3" />
        <Skeleton className="h-[80vh] w-1/3" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load dispatch details.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex w-full h-[calc(100vh-64px)]"> {/* Adjust height as needed */}
      {/* Left: Map */}
      <div className="flex-1 h-full">
        <MultiRoutesDynamicMap routes={routes} />
      </div>

      {/* Right: Sidebar */}
      <div className="w-[400px] border-l h-full overflow-y-auto bg-white shadow-md">
        <Tabs value={tab} onValueChange={setTab} className="h-full flex flex-col">
          <TabsList className="sticky top-0 z-10 bg-white">
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="pending">Pending Orders</TabsTrigger>
          </TabsList>

          {/* Routes Tab */}
          <TabsContent value="routes" className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Routes ({routes.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {routes.map((route) => (
                  <div key={route.id} className="text-sm border-b pb-2">
                    <div><strong>Vehicle:</strong> {route.vehicle?.licensePlate || "N/A"}</div>
                    <div><strong>Stops:</strong> {route.orders?.length ?? 0}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Orders Tab */}
          <TabsContent value="pending" className="p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Orders ({pendingOrders.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="text-sm border-b pb-2">
                    <div><strong>Address:</strong> {order.address || "N/A"}</div>
                    <div><strong>Weight:</strong> {order.weight} kg</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div>

        <Button onClick={() => createDispatch()} disabled={isPending}>Reroute</Button>
      </div>
    </div>
  );
}
