import DepotDynamicMarker from "@/components/map/DepotDynamicMarker";
import OrderMarker from "@/components/map/OrderMarker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteResponse } from "@/types/types";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import UpdatedRoutePolyline from "./UpdatedRoutePolyline";

interface SingleRouteStaticMapProps {
  route: RouteResponse;
}

export default function SingleRouteStaticMap({ route }: SingleRouteStaticMapProps) {
  const { orders, vehicle } = route;

  if (!orders || orders.length === 0) {
    return <p className="text-muted-foreground">No orders found for this route.</p>;
  }

  const orderPositions: LatLngExpression[] = orders.map(order => [order.latitude, order.longitude]);

  const center: LatLngExpression = orderPositions[0];

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Route Map</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full rounded-md z-0">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* <VehicleMarker vehicle={vehicle}/> */}

          {orders.map((order) => (
            <OrderMarker order={order} />
          ))}

          <DepotDynamicMarker depotId={vehicle.depotId} />

          {/* <StaticRoutePolyline depotId={route.depotId} vehicle={vehicle} orders={route.orders} /> */}

          <UpdatedRoutePolyline route={route} />

        </MapContainer>
      </CardContent>
    </Card>
  );
}
