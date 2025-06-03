import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { database } from "@/firebase";
import { useCreateDispatch } from "@/hooks/useDispatch";
import { useGetPendingOrders } from "@/hooks/useOrder";
import { DispatchResponse, RouteResponse, VehicleRealtimeData } from "@/types/types";
import { onValue, ref } from "firebase/database";
import { LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import { Button } from "../ui/button";

interface OngoingDispatchDetailsProps {
  dispatch: DispatchResponse;
  routes: RouteResponse[];
}

export default function OngoingDispatchDetails({ dispatch, routes }: OngoingDispatchDetailsProps) {
  const { mutate: createDispatch } = useCreateDispatch();
  const [vehicleRealtimeData, setVehicleRealtimeData] = useState<Record<string, VehicleRealtimeData>>({});
  const {data: ordersData, isLoading: isOrdersLoading} = useGetPendingOrders();
  const pendingOrders = ordersData?.result;

  useEffect(() => {
    const unsubscribes: Array<() => void> = [];

    routes.forEach((route) => {
      const vehicleId = route.vehicle.id;
      const vehicleRef = ref(database, `vehicles/${vehicleId}`);
      const unsubscribe = onValue(vehicleRef, (snapshot) => {
        const data: VehicleRealtimeData = snapshot.val();
        if (data) {
          setVehicleRealtimeData((prev) => ({
            ...prev,
            [vehicleId]: data,
          }));
        }
      });
      unsubscribes.push(() => unsubscribe());
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [routes]);

  const centerLatLng: LatLngExpression =
    routes[0]?.orders[0]
      ? [routes[0].orders[0].latitude, routes[0].orders[0].longitude]
      : [0, 0];

  const handleRerouteDispatch = () => {
    createDispatch();
  };

  return (
    <div className="p-4 space-y-4">
      {/* Dispatch Info */}
      <Card>
        <CardHeader>
          <CardTitle>Dispatch Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>ID:</strong> {dispatch.id}</p>
          <p><strong>Status:</strong> {dispatch.status}</p>
          <p><strong>Created At:</strong> {new Date(dispatch.createdAt).toLocaleString()}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Routes List */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-2">
              {routes.length === 0 ? (
                <p className="text-muted-foreground">No routes available.</p>
              ) : (
                <ul className="space-y-2">
                  {routes.map((route) => (
                    <li key={route.id} className="p-2 border rounded">
                      <p className="font-semibold">Route ID: {route.id}</p>
                      <p>Vehicle: {route.vehicle.licensePlate}</p>
                      <p>Orders: {route.orders.length}</p>
                      <p>Distance: {route.distance} km</p>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Live Routes & Vehicles</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] p-0">
            <MapContainer center={centerLatLng} zoom={12} className="h-full w-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {/* Realtime Vehicle Markers */}
              {routes.map((route) => {
                const vehicleId = route.vehicle.id;
                const data = vehicleRealtimeData[vehicleId];
                return (
                  data && (
                    <Marker
                      key={`vehicle-${vehicleId}`}
                      position={[data.latitude, data.longitude]}
                    >
                      <Popup>
                        <p><strong>Vehicle:</strong> {route.vehicle.licensePlate}</p>
                        <p><strong>Load:</strong> {data.load} kg</p>
                      </Popup>
                    </Marker>
                  )
                );
              })}

              {/* Order Markers and Route Lines */}
              {routes.map((route) => {
                const sortedOrders = [...route.orders].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
                return (
                  <div key={`route-${route.id}`}>
                    {/* Order Markers */}
                    {sortedOrders.map((order) => (
                      <Marker
                        key={`order-${order.id}`}
                        position={[order.latitude, order.longitude]}
                      >
                        <Popup>
                          <p><strong>Index:</strong> {order.index}</p>
                          <p><strong>Address:</strong> {order.address}</p>
                        </Popup>
                      </Marker>
                    ))}

                    {/* Route Line */}
                    <Polyline
                      positions={sortedOrders.map(
                        (order) => [order.latitude, order.longitude] as LatLngExpression
                      )}
                      color="blue"
                    />
                  </div>
                );
              })}
            </MapContainer>
          </CardContent>
        </Card>

        {/* Pending Orders + Reroute Button */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Orders</CardTitle>
            <Button
              onClick={handleRerouteDispatch}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Re-route Dispatch
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-2">
              {isOrdersLoading ? (
                <p className="text-muted-foreground">Loading pending orders...</p>
              ) : pendingOrders && pendingOrders.length > 0 ? (
                <ul className="space-y-2">
                  {pendingOrders.map((order) => (
                    <li
                      key={order.id}
                      className="p-2 border rounded bg-muted/50 text-sm"
                    >
                      <p><strong>ID:</strong> {order.id}</p>
                      <p><strong>Address:</strong> {order.address}</p>
                      <p><strong>Lat:</strong> {order.latitude}, <strong>Lng:</strong> {order.longitude}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No pending orders found.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
