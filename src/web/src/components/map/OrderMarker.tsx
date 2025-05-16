import { OrderIcon } from "@/lib/leaflet-icons"
import { OrderResponse } from "@/types/types";
import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

interface OrderMarkerProps {
  order: OrderResponse;
}

export default function OrderMarker({ order }: OrderMarkerProps) {
  const navigate = useNavigate();

  return (
    <Marker key={order.id} position={[order.latitude, order.longitude]} icon={OrderIcon}>
      <Popup>
        <strong>Order #{order.index}</strong><br />
        <p>Address: {order.address}</p>
        <p>Weight: {order.weight}kg</p>
        <Button onClick={() => navigate(`/orders/${order.id}`)}>View details</Button>
      </Popup>
    </Marker>
  );
}