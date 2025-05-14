import { DepotIcon } from "@/lib/leaflet-icons";
import { useGetDepotById } from "@/hooks/useDepot";
import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { formatDate } from "@/utils/formatDate";

interface DepotDynamicMarkerProps {
  depotId: string;
}

export default function DepotDynamicMarker({depotId}: DepotDynamicMarkerProps) {
  const navigate = useNavigate();
  const { data } = useGetDepotById(depotId);
  const depot = data?.result;

  if (!depot) return null;

  return (
    <Marker position={[depot.latitude, depot.longitude]} icon={DepotIcon}>
      <Popup>
        <strong>Depot</strong>
        <p>{depot.address}</p>
        <p>Number of vehicles: {depot.vehicles.length}</p>
        <p>Created At: {formatDate(depot.createdAt)}</p>
        <Button onClick={() => navigate(`/depots/${depotId}`)}>View details</Button>
      </Popup>
    </Marker>
  )
}