import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { RouteResponse } from "@/types/types";
import "leaflet/dist/leaflet.css";
import VehicleMarker from "@/components/map/VehicleMarker";
import OrderMarker from "@/components/map/OrderMarker";
import DepotDynamicMarker from "./DepotDynamicMarker";
import RoutePolyline from "./RoutePolyline";
import VehicleDynamicMarker from "./VehicleDynamicMarker";
import UpdatedRoutePolyline from "./UpdatedRoutePolyline";

interface SingleRouteDynamicMapProps {
  route: RouteResponse;
}

export default function SingleRouteDynamicMap({ route }: SingleRouteDynamicMapProps) {
  const { orders, vehicle } = route;

  if (!orders || orders.length === 0) {
    return <p className="text-muted-foreground">No orders found for this route.</p>;
  }

  const orderPositions: LatLngExpression[] = orders.map(order => [order.latitude, order.longitude]);

  const center: LatLngExpression = orderPositions[0];

  return (
    <div className="w-full h-full">
      <CardContent className="h-full">
        <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full rounded-md z-0">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <VehicleDynamicMarker vehicle={vehicle} />

          {orders.map((order) => (
            <OrderMarker order={order} />
          ))}

          <DepotDynamicMarker depotId={vehicle.depotId} />

          {/* <RoutePolyline depotId={route.depotId} vehicle={vehicle} orders={route.orders}/> */}
          <UpdatedRoutePolyline route={route} />

        </MapContainer>
      </CardContent>
    </div>
  );
}
