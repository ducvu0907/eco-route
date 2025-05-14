import { useGetDepotById } from "@/hooks/useDepot";
import { RouteResponse, VehicleResponse } from "@/types/types";
import { Polyline } from "react-native-maps";

interface RoutePolylineProps {
  vehicle: VehicleResponse;
  route: RouteResponse;
}

export default function RoutePolyline({ vehicle, route }: RoutePolylineProps) {
  const { data, isLoading, isError } = useGetDepotById(route.depotId);
  const depot = data?.result;

  if (isLoading || isError || !depot) {
    return null;
  }

  const sortedOrders = [...route.orders].sort((a, b) => {
    if (a.index === null) return 1;
    if (b.index === null) return -1;
    return a.index - b.index;
  });

  const coordinates = [
    {
      latitude: vehicle.currentLatitude,
      longitude: vehicle.currentLongitude
    },
    ...sortedOrders.map((order) => ({
      latitude: order.latitude,
      longitude: order.longitude,
    })),
    {
      latitude: depot.latitude,
      longitude: depot.longitude,
    },
  ];

  return (
    <Polyline
      coordinates={coordinates}
      strokeColor="#2F80ED"
      strokeWidth={4}
      lineDashPattern={[6, 3]}
    />
  );
}
