import { OrderResponse } from "@/types/types";
import OrderMarker from "../map/OrderMarker";
import { defaultCenter } from "@/config/config";
import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";

interface OrdersMapProps {
  orders: OrderResponse[];
}

export default function OrdersMap({orders}: OrdersMapProps) {
  return (
    <MapContainer
      center={defaultCenter as LatLngExpression}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {orders.map((order: OrderResponse) => (
        <OrderMarker order={order}/>
      ))}
    </MapContainer>
  );
}
