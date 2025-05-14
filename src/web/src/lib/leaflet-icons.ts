import L from "leaflet";
import depotIcon from "@/assets/depot-icon.png";
import orderIcon from "@/assets/order-icon.png";
import truckIcon from "@/assets/truck-icon.png";

// Depot icon
export const DepotIcon = L.icon({
  iconUrl: depotIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Order icon
export const OrderIcon = L.icon({
  iconUrl: orderIcon,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

// Truck (vehicle) icon
export const TruckIcon = L.icon({
  iconUrl: truckIcon,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});
