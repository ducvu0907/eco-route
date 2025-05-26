"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import { RouteResponse } from "@/types/types";
import VehicleMarker from "@/components/map/VehicleMarker";
import OrderMarker from "@/components/map/OrderMarker";
import DepotDynamicMarker from "@/components/map/DepotDynamicMarker";
import RoutePolyline from "./RoutePolyline";
import StaticRoutePolyline from "./StaticRoutePolyline";
import UpdatedRoutePolyline from "./UpdatedRoutePolyline";

interface MultiRoutesStaticMapProps {
  routes: RouteResponse[];
}

export default function MultiRoutesStaticMap({ routes }: MultiRoutesStaticMapProps) {
  if (!routes || routes.length === 0) {
    return <p className="text-muted-foreground">No routes to display.</p>;
  }

  // Center the map on the first order of the first route
  const firstOrder = routes[0].orders[0];
  const center: LatLngExpression = [firstOrder.latitude, firstOrder.longitude];

  return (
    <div className="w-full h-full">
      <CardContent className="h-full">
        <MapContainer center={center} zoom={12} scrollWheelZoom={true} className="h-full w-full rounded-md z-0">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {routes.map((route) => {
            return (
              <div key={route.id} className="w-full">
                {/* <VehicleMarker vehicle={route.vehicle} /> */}
                {route.orders.map((order) => (
                  <OrderMarker key={order.id} order={order} />
                ))}
                <DepotDynamicMarker key={`depot-${route.vehicle.depotId}`} depotId={route.vehicle.depotId} />
                <UpdatedRoutePolyline route={route} />
              </div>
            );
          })}
        </MapContainer>
      </CardContent>
    </div>
  );
}
