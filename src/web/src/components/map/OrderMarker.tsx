import { GeneralTrashIcon, HazardousTrashIcon, ElectronicTrashIcon, OrganicTrashIcon, RecyclableTrashIcon } from "@/lib/leaflet-icons"
import { OrderResponse, TrashCategory } from "@/types/types";
import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

interface OrderMarkerProps {
  order: OrderResponse;
}

export const getOrderIcon = (category: TrashCategory) => {
  switch(category) {
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
  };
}

export default function OrderMarker({ order }: OrderMarkerProps) {
  const navigate = useNavigate();

  return (
    <Marker key={order.id} position={[order.latitude, order.longitude]} icon={getOrderIcon(order.category)}>
      <Popup>
        <strong>Order #{order.index}</strong><br />
        <p>Address: {order.address}</p>
        <p>Weight: {order.weight}kg</p>
        <p>Status: {order.status}kg</p>
        <Button onClick={() => navigate(`/orders/${order.id}`)}>View details</Button>
      </Popup>
    </Marker>
  );
}