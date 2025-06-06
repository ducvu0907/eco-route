import { DepotIcon } from "@/lib/leaflet-icons";
import { DepotResponse } from "@/types/types";
import { formatDate } from "@/utils/formatDate";
import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import L from "leaflet";

interface DepotMarkerProps {
  depot: DepotResponse;
  setSelected?: () => void;
  isSelected?: boolean;
}

export default function DepotMarker({depot, setSelected, isSelected}: DepotMarkerProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker position={[depot.latitude, depot.longitude]} icon={DepotIcon} eventHandlers={{ click: setSelected }} ref={markerRef}>
      <Popup>
        <strong>{t("depotMarker.title")}</strong>
        <p>{depot.address}</p>
        <p>{t("depotMarker.numberOfVehicles")} {depot.vehicles.length}</p>
        <p>{t("depotMarker.createdAt")} {formatDate(depot.createdAt)}</p>
        <Button onClick={() => navigate(`/depots/${depot.id}`)}>{t("depotMarker.viewDetails")}</Button>
      </Popup>
    </Marker>
  )
}