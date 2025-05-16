import { useParams } from "react-router";
import NotFound from "../NotFound";
import { useGetVehicleById } from "@/hooks/useVehicle";
import { useGetRoutesByVehicleId } from "@/hooks/useRoute";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RouteResponse, VehicleResponse, OrderResponse, RouteStatus } from "@/types/types";
import { Button } from "@/components/ui/button";
import VehicleUpdateModal from "@/components/vehicle/VehicleUpdateModal";
import { LatLngExpression } from "leaflet";
import { useGetDepotById } from "@/hooks/useDepot";
import SingleRouteStaticMap from "@/components/map/SingleRouteStaticMap";
import SingleRouteDynamicMap from "@/components/map/SingleRouteDynamicMap";

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

  const { data: depotData, isLoading: isDepotLoading } = useGetDepotById(vehicle?.depotId || "");
  const depot = depotData?.result;

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

  if (isVehicleError || isRoutesError || !vehicle || !depot) {
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
          <p><strong>Driver:</strong> {vehicle.driver.username}</p>
          <p><strong>Depot:</strong> {depot.address}</p>
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
                      className={`p-2 border rounded cursor-pointer ${selectedRoute?.id === route.id
                          ? "bg-primary text-white"
                          : "hover:bg-muted"
                        }`}
                    >
                      <p className="font-semibold">Route ID: {route.id}</p>
                      <p>Distance: {route.distance} km</p>
                      <p>Orders: {route.orders.length}</p>
                      <p>Status: {route.status}</p>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Map Section */}
        {selectedRoute ? (
          <>
            {selectedRoute && selectedRoute.status === RouteStatus.IN_PROGRESS && <SingleRouteDynamicMap route={selectedRoute} />}
            {selectedRoute && selectedRoute.status === RouteStatus.COMPLETED && <SingleRouteStaticMap route={selectedRoute} />}
          </>
        ) : (
          <Card className="flex items-center justify-center h-full text-muted-foreground">
            Select a route to view map.
          </Card>
        )}

      </div>
    </div>
  );
}
