import { useGetDepotById } from "@/hooks/useDepot";
import { OrderStatus, RouteResponse, VehicleResponse } from "@/types/types";
import MapView, { ShapeSource, LineLayer } from "@maplibre/maplibre-react-native";
import type { FeatureCollection, LineString } from 'geojson';

interface RoutePolylineProps {
  lon?: number;
  lat?: number;
  vehicle: VehicleResponse;
  route: RouteResponse;
}

export default function DemoRoutePolyline({ lon, lat, vehicle, route }: RoutePolylineProps) {
  const { data, isLoading, isError } = useGetDepotById(route.depotId);
  const depot = data?.result;

  if (isLoading || isError || !depot) {
    return null;
  }

  const sortedOrders = [...route.orders]
    .filter(order => order.status !== OrderStatus.COMPLETED)
    .sort((a, b) => {
      if (a.index === null) return 1;
      if (b.index === null) return -1;
      return a.index - b.index;
    });

  const coordinates = [
    [lon || vehicle.currentLongitude, lat || vehicle.currentLatitude],
    ...sortedOrders.map((order) => [order.longitude, order.latitude]),
    [depot.longitude, depot.latitude],
  ];

  const routeGeoJSON: FeatureCollection<LineString> = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates,
        },
        properties: {},
      },
    ],
  };

  return (
    <ShapeSource id="route-source" shape={routeGeoJSON}>
      <LineLayer
        id="route-line"
        style={{
          lineColor: "#2F80ED",
          lineWidth: 4,
          lineDasharray: [6, 3],
        }}
      />
    </ShapeSource>
  );
}
