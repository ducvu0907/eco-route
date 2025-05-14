import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DispatchResponse, RouteResponse, OrderResponse } from "@/types/types";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import { useMemo } from "react";
import MultiRoutesStaticMap from "../map/MultiRoutesStaticMap";

interface CompletedDispatchDetailsProps {
  dispatch: DispatchResponse;
  routes: RouteResponse[];
}

export default function CompletedDispatchDetails({ dispatch, routes }: CompletedDispatchDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Dispatch info */}
      <Card>
        <CardHeader>
          <CardTitle>Dispatch Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>ID:</strong> {dispatch.id}</p>
          <p><strong>Status:</strong> {dispatch.status}</p>
          <p><strong>Created At:</strong> {new Date(dispatch.createdAt).toLocaleString()}</p>
          <p><strong>Completed At:</strong> {new Date(dispatch.completedAt).toLocaleString()}</p>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        {/* Routes list - left 1/3 */}
        <div className="w-1/3">
          <ScrollArea className="h-[600px] pr-2">
            {routes.map((route, i) => (
              <Card key={route.id} className="mb-4">
                <CardHeader>
                  <CardTitle>Route #{i + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Vehicle:</strong> {route.vehicle.licensePlate}</p>
                  <p><strong>Distance:</strong> {route.distance.toFixed(2)} km</p>
                  <p><strong>Status:</strong> {route.status}</p>
                  <Separator className="my-2" />
                  <p className="font-semibold">Orders:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {route.orders
                      .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
                      .map(order => (
                        <li key={order.id}>
                          #{order.index}: {order.address} ({order.weight}kg)
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </div>

        {/* Map - right 2/3 */}
        <div className="w-2/3 h-[600px]">
          <MultiRoutesStaticMap routes={routes} />
        </div>
      </div>
    </div>
  );
}
