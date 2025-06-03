import OrderMarker from "@/components/map/OrderMarker";
import VehicleDynamicMarker from "@/components/map/VehicleDynamicMarker";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { defaultCenter } from "@/config/config";
import { useGetVehicles } from "@/hooks/useVehicle";
import { OrderResponse } from "@/types/types";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer } from "react-leaflet";

export default function PendingOrdersMap({ orders }: { orders: OrderResponse[] }) {
  const { data: vehicleData } = useGetVehicles();

  const vehicles = vehicleData?.result || [];

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
