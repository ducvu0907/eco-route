import { useGetDepotById } from "@/hooks/useDepot";
import { OrderStatus, RouteResponse, VehicleResponse } from "@/types/types";
import MapView, { ShapeSource, LineLayer } from "@maplibre/maplibre-react-native";
import type { FeatureCollection, LineString } from 'geojson';

interface RoutePolylineProps {
  route: RouteResponse;
}

export default function DemoRoutePolyline({route}: RoutePolylineProps) {
  const coordinates = route.coordinates.map((coord) => coord.reverse());

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
        }}
      />
    </ShapeSource>
  );
}
