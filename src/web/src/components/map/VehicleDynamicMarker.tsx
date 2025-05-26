import { CompactorTruckIcon, ThreeWheelerIcon } from "@/lib/leaflet-icons";
import { VehicleResponse, VehicleType } from "@/types/types";
import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { useVehicleRealtimeData } from "@/hooks/useVehicleRealtimeData";

interface VehicleDynamicMarkerProps {
  vehicle: VehicleResponse;
}

export const getVehicleIcon = (type: VehicleType) => {
  switch (type) {
    case VehicleType.COMPACTOR_TRUCK:
      return CompactorTruckIcon;
    case VehicleType.THREE_WHEELER:
      return ThreeWheelerIcon;
  };
};

export default function VehicleDynamicMarker({ vehicle }: VehicleDynamicMarkerProps) {
  const navigate = useNavigate();

  const realtimeData = useVehicleRealtimeData(vehicle.id);

  const lat = realtimeData?.latitude ?? vehicle.currentLatitude;
  const lng = realtimeData?.longitude ?? vehicle.currentLongitude;
  const load = realtimeData?.load ?? vehicle.currentLoad;

  return (
    <Marker position={[lat, lng]} icon={getVehicleIcon(vehicle.type)}>
      <Popup>
        <strong>Vehicle:</strong> {vehicle.licensePlate} <br />
        Load: {load}kg <br />
        <Button onClick={() => navigate(`/vehicles/${vehicle.id}`)} className="mt-2">
          View details
        </Button>
      </Popup>
    </Marker>
  );
}
