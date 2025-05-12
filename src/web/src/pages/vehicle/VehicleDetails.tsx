import { useParams } from "react-router";
import NotFound from "../NotFound";
import { useGetVehicleById } from "@/hooks/useVehicle";
import { useGetRoutesByVehicleId } from "@/hooks/useRoute";
import { useGetUserById } from "@/hooks/useUser";
import { useGetDepotById } from "@/hooks/useDepot";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RouteResponse, VehicleResponse, OrderResponse } from "@/types/types";
import { Button } from "@/components/ui/button";
import VehicleUpdateModal from "@/components/vehicle/VehicleUpdateModal";

export default function VehicleDetails() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [selectedRoute, setSelectedRoute] = useState<RouteResponse | null>(null);

  if (!vehicleId) return <NotFound />;

  const {
    data: vehicleData,
    isLoading: isVehicleLoading,
    isError: isVehicleError,
  } = useGetVehicleById(vehicleId);

  const {
    data: routesData,
    isLoading: isRoutesLoading,
    isError: isRoutesError,
  } = useGetRoutesByVehicleId(vehicleId);

  const vehicle: VehicleResponse | null = vehicleData?.result ?? null;
  const routes: RouteResponse[] = routesData?.result ?? [];

  const {
    data: driverData,
    isLoading: isDriverLoading,
  } = useGetUserById(vehicle?.driverId ?? "");

  const {
    data: depotData,
    isLoading: isDepotLoading,
  } = useGetDepotById(vehicle?.depotId ?? "");

  if (isVehicleLoading || isRoutesLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  if (isVehicleError || isRoutesError || !vehicle) {
    return <NotFound />;
  }

  return (
    <div className="p-4 space-y-4">
      <VehicleUpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicle={vehicle}
      />

      {/* Vehicle Info */}
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Vehicle Details</CardTitle>
          <Button onClick={() => setModalOpen(true)}>Edit</Button>
        </CardHeader>
        <CardContent>
          <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
          <p><strong>Status:</strong> {vehicle.status}</p>
          <p><strong>Capacity:</strong> {vehicle.capacity} kg</p>
          <p><strong>Current Load:</strong> {vehicle.currentLoad ?? 0} kg</p>
          <p>
            <strong>Driver:</strong>{" "}
            {isDriverLoading
              ? "Loading..."
              : driverData?.result?.username ?? "N/A"}
          </p>
          <p>
            <strong>Depot:</strong>{" "}
            {isDepotLoading
              ? "Loading..."
              : depotData?.result?.address ?? "N/A"}
          </p>
        </CardContent>
      </Card>

      {/* Layout: Routes and Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Routes List */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-2">
              {routes.length === 0 ? (
                <p className="text-muted-foreground">No routes available.</p>
              ) : (
                <ul className="space-y-2">
                  {routes.map((route) => (
                    <li
                      key={route.id}
                      onClick={() => setSelectedRoute(route)}
                      className={`p-2 border rounded cursor-pointer ${
                        selectedRoute?.id === route.id
                          ? "bg-primary text-white"
                          : "hover:bg-muted"
                      }`}
                    >
                      <p className="font-semibold">Route ID: {route.id}</p>
                      <p>Total Distance: {route.distance} km</p>
                      <p>Orders: {route.orders.length}</p>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Map Section */}
        <Card>
          <CardHeader>
            <CardTitle>Route Map</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] p-0">
            {selectedRoute && selectedRoute.orders.length > 0 ? (
              <MapContainer
                center={[
                  selectedRoute.orders[0].latitude,
                  selectedRoute.orders[0].longitude,
                ]}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {selectedRoute.orders.map((order: OrderResponse) => (
                  <Marker
                    key={order.id}
                    position={[order.latitude, order.longitude]}
                  />
                ))}
                <Polyline
                  positions={selectedRoute.orders.map((order) => [
                    order.latitude,
                    order.longitude,
                  ])}
                  color="blue"
                />
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {selectedRoute
                  ? "No orders in this route."
                  : "Select a route to view map."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
