import { ElectronicTrashIcon, GeneralTrashIcon, HazardousTrashIcon, OrganicTrashIcon, RecyclableTrashIcon } from "@/lib/leaflet-icons";
import { OrderResponse, TrashCategory } from "@/types/types";
import { useTranslation } from "react-i18next";
import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import L from "leaflet";

interface OrderMarkerProps {
  order: OrderResponse;
  setSelected?: () => void;
  isSelected?: boolean;
}

export const getOrderIcon = (category: TrashCategory) => {
  switch (category) {
    case TrashCategory.GENERAL:
      return GeneralTrashIcon;
    case TrashCategory.HAZARDOUS:
      return HazardousTrashIcon;
    case TrashCategory.ELECTRONIC:
      return ElectronicTrashIcon;
    case TrashCategory.RECYCLABLE:
      return RecyclableTrashIcon;
    case TrashCategory.ORGANIC:
      return OrganicTrashIcon;
  }
}

export default function OrderMarker({ order, setSelected, isSelected}: OrderMarkerProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker key={order.id} position={[order.latitude, order.longitude]} icon={getOrderIcon(order.category)} eventHandlers={{click: setSelected}} ref={markerRef}>
      <Popup>
        <strong>{t("orderMarker.orderNumber", { index: order.index })}</strong><br />
        <p>{t("orderMarker.address")}: {order.address}</p>
        <p>{t("orderMarker.weight")}: {order.weight}kg</p>
        <p>{t("orderMarker.status")}: {t(`orderMarker.statuses.${order.status}`)}</p>
        <Button onClick={() => navigate(`/orders/${order.id}`)}>{t("orderMarker.viewDetails")}</Button>
      </Popup>
    </Marker>
  );
}
