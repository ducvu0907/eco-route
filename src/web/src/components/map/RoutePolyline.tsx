import { useGetDepotById } from "@/hooks/useDepot";
import { useVehicleRealtimeData } from "@/hooks/useVehicleRealtimeData";
import { OrderResponse, OrderStatus, VehicleResponse } from "@/types/types";
import L, { LatLngExpression } from "leaflet";
import { Loader2 } from "lucide-react";
import { Polyline, useMap } from "react-leaflet";
import "leaflet-arrowheads";

interface RoutePolylinePropps {
  depotId: string;
  orders: OrderResponse[];
  vehicle: VehicleResponse;
}

export default function RoutePolyline({ orders, depotId, vehicle }: RoutePolylinePropps) {
  const map = useMap();
  const { data, isLoading } = useGetDepotById(depotId);
  const realtimeData = useVehicleRealtimeData(vehicle.id);

  if (isLoading) {
    return (
      <Loader2 />
    );
  }

  const depot = data?.result;

  const lat = realtimeData?.latitude || vehicle.currentLatitude;
  const lng = realtimeData?.longitude || vehicle.currentLongitude;

  const sortedOrders = orders
    .filter((order) => order.status !== OrderStatus.COMPLETED)
    .sort((a, b) => (a.index as number) - (b.index as number))
    .map(o => [o.latitude, o.longitude] as LatLngExpression);

  const positions: LatLngExpression[] = [[lat, lng], ...sortedOrders, [depot?.latitude, depot?.longitude] as LatLngExpression];
  // const positions: LatLngExpression[] = [[lat, lng], ...sortedOrders];
  // const positions: LatLngExpression[] = [...sortedOrders, [depot?.latitude, depot?.longitude] as LatLngExpression];

  // Create the polyline
  const polyline = L.polyline(positions, { color: "blue" }).addTo(map);

  // Add arrowheads
  polyline.arrowheads({
    size: "20px",
    fill: true,
    color: 'red',
    stroke: true,
    weight: 2,
  });

  return (
    <>
      {/* <Polyline positions={[[lat, lng], sortedOrders[0]]} color="blue" /> */}
      <Polyline positions={positions} color="blue" />
    </>
  );
}
