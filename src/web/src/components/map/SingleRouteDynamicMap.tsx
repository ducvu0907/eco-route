import OrderMarker from "@/components/map/OrderMarker";
import { CardContent } from "@/components/ui/card";
import { RouteResponse } from "@/types/types";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import DepotDynamicMarker from "./DepotDynamicMarker";
import UpdatedRoutePolyline from "./UpdatedRoutePolyline";
import VehicleDynamicMarker from "./VehicleDynamicMarker";

interface SingleRouteDynamicMapProps {
  route: RouteResponse;
}

export default function SingleRouteDynamicMap({ route }: SingleRouteDynamicMapProps) {
  const { orders, vehicle } = route;

  if (!orders || orders.length === 0) {
    return <p className="text-muted-foreground">No orders found for this route.</p>;
  }

  const center: LatLngExpression = [route.vehicle.currentLatitude, route.vehicle.currentLongitude]

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
