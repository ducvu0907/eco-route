import { VehicleResponse } from "@/types/types";
import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { TruckIcon } from "@/lib/leaflet-icons";

interface VehicleMarkerProps {
  vehicle: VehicleResponse;
}

export default function VehicleMarker({ vehicle }: VehicleMarkerProps) {
  const navigate = useNavigate();
  
  return (
    <Marker position={[vehicle.currentLatitude, vehicle.currentLongitude]} icon={TruckIcon}>
      <Popup>
        <strong>Vehicle:</strong> {vehicle.licensePlate} <br />
        <p>Load: {vehicle.currentLoad}kg</p>
        <Button variant="outline" onClick={() => navigate(`/vehicles/${vehicle.id}`)}>View details</Button>
      </Popup>
    </Marker>
  );
}