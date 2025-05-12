export interface ApiResponse<T> {
  code: string; // 00 - succeed, 99 - fail
  message: string;
  result: T | null;
}




// enums
export enum Role {
  CUSTOMER = "CUSTOMER", 
  DRIVER = "DRIVER", 
  MANAGER = "MANAGER"
}

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  CANCELLED = "CANCELLED"
}

export enum VehicleStatus {
  IDLE = "IDLE",
  ACTIVE = "ACTIVE",
  REPAIR = "REPAIR"
}

export enum DispatchStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}



// requests
export interface RegisterRequest {
  username: string;
  password: string;
  phone: string;
  fcmToken: string | null;
  role: Role;
}

export interface LoginRequest {
  username: string;
  fcmToken: string | null;
  password: string;
}

export interface DepotCreateRequest {
  latitude: number;
  longitude: number;
  address: string;
}

export interface DepotUpdateRequest {
  latitude: number;
  longitude: number;
  address: string;
}

export interface OrderCreateRequest {
  latitude: number;
  longitude: number;
  address: string;
  weight: number;
}

export interface OrderUpdateRequest {
  status: OrderStatus;
}

export interface VehicleCreateRequest {
  driverId: string | null;
  depotId: string | null;
  licensePlate: string;
  capacity: number;
}

export interface VehicleUpdateRequest {
  driverId: string | null;
  depotId: string | null;
}






// responses
export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  role: Role;
}

export interface DepotResponse {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  vehicles: VehicleResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface DispatchResponse {
  id: string;
  status: DispatchStatus;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  id: string;
  index: number | null;
  userId: string;
  routeId: string | null;
  latitude: number;
  longitude: number;
  address: string;
  weight: number;
  status: OrderStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// export interface OsmAddress {
//   amenity?: string;
//   house_number?: string;
//   road?: string;
//   neighbourhood?: string;
//   suburb?: string;
//   city?: string;
//   postcode?: string;
//   country?: string;
//   country_code?: string;
//   [key: string]: string | undefined; // for extra dynamic fields like ISO3166-2-lvl4
// }

export interface OsmResponse {
  place_id?: number;
  licence?: string;
  osm_type?: string;
  osm_id?: number;
  lat?: string;
  lon?: string;
  class?: string;
  type?: string;
  place_rank?: number;
  importance?: number;
  addresstype?: string;
  name?: string;
  display_name?: string;
  boundingbox?: string[];
  // address?: OsmAddress;
  error?: string;
}

export interface RouteResponse {
  id: string;
  vehicleId: string;
  dispatchId: string;
  totalDistance: number;
  orders: OrderResponse[];
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  id: string;
  username: string;
  phone: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleResponse {
  id: string;
  driverId: string | null;
  depotId: string | null;
  licensePlate: string;
  capacity: number;
  currentLatitude: number | null;
  currentLongitude: number | null;
  currentLoad: number | null;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
}
