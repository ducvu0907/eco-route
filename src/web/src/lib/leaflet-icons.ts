import L from "leaflet";
import Depot from "@/assets/depot-icon.png";
import Order from "@/assets/order-icon.png";
import Truck from "@/assets/truck-icon.png";
import CompactorTruck from "@/assets/compactor-truck.png";
import ThreeWheeler from "@/assets/three-wheeler.png";
import GeneralTrash from "@/assets/general-trash.png";
import HazardousTrash from "@/assets/hazardous-trash.png";
import ElectronicTrash from "@/assets/electronic-trash.png";
import RecyclableTrash from "@/assets/recyclable-trash.png";
import OrganicTrash from "@/assets/organic-trash.png";

// Depot icon
export const DepotIcon = L.icon({
  iconUrl: Depot,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Order icon
export const OrderIcon = L.icon({
  iconUrl: Order,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

// Truck (general vehicle) icon
export const TruckIcon = L.icon({
  iconUrl: Truck,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

// Compactor Truck icon
export const CompactorTruckIcon = L.icon({
  iconUrl: CompactorTruck,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Three-Wheeler Garbage Trolley icon
export const ThreeWheelerIcon = L.icon({
  iconUrl: ThreeWheeler,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Trash Type Icons

export const GeneralTrashIcon = L.icon({
  iconUrl: GeneralTrash,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const HazardousTrashIcon = L.icon({
  iconUrl: HazardousTrash,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const ElectronicTrashIcon = L.icon({
  iconUrl: ElectronicTrash,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const RecyclableTrashIcon = L.icon({
  iconUrl: RecyclableTrash,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const OrganicTrashIcon = L.icon({
  iconUrl: OrganicTrash,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
