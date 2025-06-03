import DepotDynamicMarker from "@/components/map/DepotDynamicMarker";
import OrderMarker from "@/components/map/OrderMarker";
import { Card, CardContent } from "@/components/ui/card";
import { RouteResponse } from "@/types/types";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import UpdatedRoutePolyline from "./UpdatedRoutePolyline";
import VehicleDynamicMarker from "./VehicleDynamicMarker";

interface MultiRoutesDynamicMapProps {
  routes: RouteResponse[];
}

export default function MultiRoutesDynamicMap({ routes }: MultiRoutesDynamicMapProps) {
  if (!routes || routes.length === 0) {
    return <p className="text-muted-foreground">No routes to display.</p>;
  }

  const center: LatLngExpression = [routes[0].vehicle.currentLatitude, routes[0].vehicle.currentLongitude];

  return (
    <Card className="w-full h-full">
      <CardContent className="h-full">
        <MapContainer center={center} zoom={12} scrollWheelZoom={true} className="h-full w-full rounded-md z-0">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {routes.map((route, _) => {
            return (
              <div key={route.id}>
                <VehicleDynamicMarker vehicle={route.vehicle} />
                {route.orders.map((order) => (
                  <OrderMarker key={order.id} order={order} />
                ))}
                <DepotDynamicMarker key={`depot-${route.vehicle.depotId}`} depotId={route.vehicle.depotId} />
                {/* <RoutePolyline key={`polyline-${route.id}`} vehicle={route.vehicle} depotId={route.depotId} orders={route.orders} /> */}
                <UpdatedRoutePolyline route={route} />
              </div>
            );
          })}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
