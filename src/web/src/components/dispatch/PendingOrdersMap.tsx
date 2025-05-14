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

export default function PendingOrdersMap() {
  const { data: orderData, isLoading: isOrdersLoading, isError: isOrdersError } = useGetPendingOrders();
  const { data: vehicleData, isLoading: isVehiclesLoading, isError: isVehiclesError } = useGetVehicles();

  const orders = orderData?.result || [];
  const vehicles = vehicleData?.result || [];

  const isLoading = isOrdersLoading || isVehiclesLoading;
  const isError = isOrdersError || isVehiclesError;

  if (isLoading) {
    return (
      <Card className="w-full h-[600px] p-6">
        <CardHeader>
          <CardTitle>Loading Map...</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[500px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load map data.</AlertDescription>
      </Alert>
    );
  }

  if (!orders.length && !vehicles.length) {
    return (
      <Card className="w-full h-[600px] p-6">
        <CardHeader>
          <CardTitle>No Pending Orders or Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nothing to display on the map.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px]">
      <CardHeader>
        <CardTitle>Pending Orders & Vehicles</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <MapContainer center={defaultCenter as LatLngExpression} zoom={12} scrollWheelZoom={true} className="h-full w-full rounded-md z-0">
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
      </CardContent>
    </Card>
  );
}
