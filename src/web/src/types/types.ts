export interface ApiResponse<T> {
  code: string; // 00 - succeed, 99 - fail
  message: string;
  result: T | null;
}




// enums
export enum TrashCategory {
  GENERAL = "GENERAL",
  ORGANIC = "ORGANIC",
  RECYCLABLE = "RECYCLABLE",
  HAZARDOUS = "HAZARDOUS",
  ELECTRONIC = "ELECTRONIC"
}

export enum VehicleType {
  THREE_WHEELER = "THREE_WHEELER",
  COMPACTOR_TRUCK = "COMPACTOR_TRUCK"
}

export enum Role {
  CUSTOMER = "CUSTOMER", 
  DRIVER = "DRIVER", 
  MANAGER = "MANAGER"
}

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum VehicleStatus {
  IDLE = "IDLE",
  ACTIVE = "ACTIVE",
  REPAIR = "REPAIR"
}

export enum RouteStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
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
  description: string | null;
  category: TrashCategory;
  address: string;
  weight: number;
}

// TODO: fix this
export interface OrderUpdateRequest {
  status: OrderStatus;
}


export interface VehicleCreateRequest {
  driverId: string;
  depotId: string;
  licensePlate: string;
  type: VehicleType;
  category: TrashCategory;
}


export interface VehicleUpdateRequest {
  driverId: string | null;
  depotId: string | null;
  status: VehicleStatus | null;
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
  imageUrl: string | null;
  description: string | null;
  category: TrashCategory; 
  weight: number;
  status: OrderStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OsmAddress {
  amenity?: string;
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
  [key: string]: string | undefined; // for extra dynamic fields like ISO3166-2-lvl4
}

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
  address?: OsmAddress;
  error?: string;
}

export interface RouteResponse {
  id: string;
  vehicle: VehicleResponse;
  dispatchId: string;
  depotId: string;
  distance: number;
  status: RouteStatus;
  orders: OrderResponse[];
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  duration: number;
  coordinates: number[][]; // list of points (lat,lon]) to draw the route with precision
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
  driver: UserResponse;
  depotId: string;
  licensePlate: string;
  capacity: number;
  currentLatitude: number;
  currentLongitude: number;
  currentLoad: number;
  type: VehicleType;
  category: TrashCategory;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
}


// firebase realtime vehicle schemas
export interface VehicleRealtimeData {
  latitude: number;
  longitude: number;
  load: number;
}