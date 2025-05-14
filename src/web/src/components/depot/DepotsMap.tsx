import { DepotResponse } from "@/types/types";
import { defaultCenter } from "@/config/config";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import DepotMarker from "../map/DepotMarker";

interface DepotsMapProps {
  depots: DepotResponse[];
}

export default function DepotsMap({ depots }: DepotsMapProps) {
  return (
    <MapContainer
      center={defaultCenter as LatLngExpression}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {depots.map((depot: DepotResponse) => (
        <DepotMarker depot={depot} />
      ))}
    </MapContainer>

  );
}
