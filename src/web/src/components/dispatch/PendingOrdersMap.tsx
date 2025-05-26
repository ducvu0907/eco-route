// PendingOrdersMap.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { useGetPendingOrders } from "@/hooks/useOrder";
import { useGetVehicles } from "@/hooks/useVehicle";
import OrderMarker from "@/components/map/OrderMarker";
import VehicleDynamicMarker from "@/components/map/VehicleDynamicMarker";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { defaultCenter } from "@/config/config";
import { MapPin, Package, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PendingOrdersMap() {
  const { data: orderData, isLoading: isOrdersLoading, isError: isOrdersError } = useGetPendingOrders();
  const { data: vehicleData, isLoading: isVehiclesLoading, isError: isVehiclesError } = useGetVehicles();

  const orders = orderData?.result || [];
  const vehicles = vehicleData?.result || [];

  const isLoading = isOrdersLoading || isVehiclesLoading;
  const isError = isOrdersError || isVehiclesError;

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Loading Map...
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <Skeleton className="h-full w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="h-full flex items-center justify-center">
        <div className="text-center">
          <AlertTitle>Error Loading Map</AlertTitle>
          <AlertDescription>Failed to load map data. Please try again.</AlertDescription>
        </div>
      </Alert>
    );
  }

  if (!orders.length && !vehicles.length) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="mb-2">No Data to Display</CardTitle>
          <p className="text-muted-foreground">No pending orders or vehicles available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full">
      {/* <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Dispatch Overview
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {orders.length} Orders
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {vehicles.length} Vehicles
            </Badge>
          </div>
        </div>
      </CardHeader> */}
      <CardContent className="h-full p-0">
        <div className="h-full rounded-lg overflow-hidden">
          <MapContainer 
            center={defaultCenter as LatLngExpression} 
            zoom={12} 
            scrollWheelZoom={true} 
            className="h-full w-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {orders.map((order) => (
              <OrderMarker key={order.id} order={order} />
            ))}

            {vehicles.map((vehicle) => (
              <VehicleDynamicMarker key={vehicle.id} vehicle={vehicle} />
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </div>
  );
}
