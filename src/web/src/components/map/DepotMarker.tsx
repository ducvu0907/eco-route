import { DepotIcon } from "@/lib/leaflet-icons";
import { useGetDepotById } from "@/hooks/useDepot";
import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { formatDate } from "@/utils/formatDate";
import { DepotResponse } from "@/types/types";

interface DepotMarkerProps {
  depot: DepotResponse;
}

export default function DepotMarker({depot}: DepotMarkerProps) {
  const navigate = useNavigate();

  return (
    <Marker position={[depot.latitude, depot.longitude]} icon={DepotIcon}>
      <Popup>
        <strong>Depot</strong>
        <p>{depot.address}</p>
        <p>Number of vehicles: {depot.vehicles.length}</p>
        <p>Created At: {formatDate(depot.createdAt)}</p>
        <Button onClick={() => navigate(`/depots/${depot.id}`)}>View details</Button>
      </Popup>
    </Marker>
  )
}