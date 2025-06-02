import { DepotIcon } from "@/lib/leaflet-icons";
import { useGetDepotById } from "@/hooks/useDepot";
import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { formatDate } from "@/utils/formatDate";
import { useTranslation } from "react-i18next";

interface DepotDynamicMarkerProps {
  depotId: string;
}

export default function DepotDynamicMarker({ depotId }: DepotDynamicMarkerProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data } = useGetDepotById(depotId);
  const depot = data?.result;

  if (!depot) return null;

  return (
    <Marker position={[depot.latitude, depot.longitude]} icon={DepotIcon}>
      <Popup>
        <strong>{t("depotDynamicMarker.depot")}</strong>
        <p>{depot.address}</p>
        <p>{t("depotDynamicMarker.numberOfVehicles")}: {depot.vehicles.length}</p>
        <p>{t("depotDynamicMarker.createdAt")}: {formatDate(depot.createdAt)}</p>
        <Button onClick={() => navigate(`/depots/${depotId}`)}>
          {t("depotDynamicMarker.viewDetails")}
        </Button>
      </Popup>
    </Marker>
  );
}
