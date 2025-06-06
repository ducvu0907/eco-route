import { CompactorTruckIcon, ThreeWheelerIcon } from "@/lib/leaflet-icons";
import { VehicleResponse, VehicleType } from "@/types/types";
import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { useVehicleRealtimeData } from "@/hooks/useVehicleRealtimeData";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import L from "leaflet";

interface VehicleDynamicMarkerProps {
  vehicle: VehicleResponse;
  setSelected?: () => void;
  isSelected?: boolean;
}

export const getVehicleIcon = (type: VehicleType) => {
  switch (type) {
    case VehicleType.COMPACTOR_TRUCK:
      return CompactorTruckIcon;
    case VehicleType.THREE_WHEELER:
      return ThreeWheelerIcon;
  }
};

export default function VehicleDynamicMarker({ vehicle, setSelected, isSelected }: VehicleDynamicMarkerProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const markerRef = useRef<L.Marker>(null);

  const realtimeData = useVehicleRealtimeData(vehicle.id);

  const lat = realtimeData?.latitude ?? vehicle.currentLatitude;
  const lng = realtimeData?.longitude ?? vehicle.currentLongitude;
  const load = realtimeData?.load ?? vehicle.currentLoad;

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker position={[lat, lng]} icon={getVehicleIcon(vehicle.type)} eventHandlers={{ click: setSelected }} ref={markerRef}>
      <Popup>
        <strong>{t("vehicleDynamicMarker.vehicle")}</strong>: {vehicle.licensePlate} <br />
        {t("vehicleDynamicMarker.load")}: {load}kg <br />
        <Button onClick={() => navigate(`/vehicles/${vehicle.id}`)} className="mt-2">
          {t("vehicleDynamicMarker.viewDetails")}
        </Button>
      </Popup>
    </Marker>
  );
}
