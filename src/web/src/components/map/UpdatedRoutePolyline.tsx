import { RouteResponse } from "@/types/types";
import L, { LatLngExpression } from "leaflet";
import { Polyline, useMap } from "react-leaflet";
import "leaflet-arrowheads";

interface UpdatedRoutePolylineProps {
  route: RouteResponse;
  color?: string;
}

export default function UpdatedRoutePolyline({ route, color }: UpdatedRoutePolylineProps) {
  const map = useMap();
  const positions = route.coordinates as LatLngExpression[];

  const polyline = L.polyline(positions, { color: color || "blue" }).addTo(map);
  polyline.arrowheads({
    frequency: 20,
    size: "5px",
    fill: true,
    color: 'red',
    stroke: true,
    weight: 2,
  });

  return <Polyline positions={positions} />;
}
