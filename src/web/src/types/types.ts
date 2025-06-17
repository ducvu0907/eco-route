export interface ApiResponse<T> {
  code: string; // 00 - succeed, 99 - fail
  message: string;
  result: T | null;
}




// enums
export enum NotificationType {
  ORDER = "ORDER",
  ROUTE = "ROUTE",
  DISPATCH = "DISPATCH"
}

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
  REASSIGNED = "REASSIGNED",
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
  category: TrashCategory;
}

export interface DepotUpdateRequest {
  latitude: number;
  longitude: number;
  address: string;
  category: TrashCategory;
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
  category: TrashCategory;
  createdAt: string;
  updatedAt: string;
}

export interface DispatchResponse {
  id: string;
  status: DispatchStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  id: string;
  content: string;
  type: NotificationType;
  refId: string;
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

export interface RouteResponse {
  id: string;
  vehicle: VehicleResponse;
  dispatchId: string;
  distance: number;
  status: RouteStatus;
  orders: OrderResponse[];
  completedAt: string | null;
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


export interface OrsApiResponse {
  type: "FeatureCollection";
  geocoding?: Record<string, any>; // Add proper typing if geocoding structure is known
  features: Feature[];
  bbox?: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
}

export interface Feature {
  type: "Feature";
  geometry: Geometry;
  properties: Properties;
  bbox?: [number, number, number, number];
}

export interface Geometry {
  type: "Point" | "LineString" | "Polygon" | string; // Extend for other types if needed
  coordinates: number[]; // e.g., [longitude, latitude]
}

export interface Properties {
  [key: string]: any; // Use this if properties are dynamic

  // Optional: define specific known fields if available, e.g.:
  id?: string;
  gid?: string;
  layer?: string;
  source?: string;
  source_id?: string;
  name?: string;
  confidence?: number;
  distance?: number;
  accuracy?: string;
  country?: string;
  country_gid?: string;
  country_a?: string;
  macroregion?: string;
  macroregion_gid?: string;
  macroregion_a?: string;
  region?: string;
  region_gid?: string;
  region_a?: string;
  localadmin?: string;
  localadmin_gid?: string;
  locality?: string;
  locality_gid?: string;
  borough?: string;
  borough_gid?: string;
  neighbourhood?: string;
  neighbourhood_gid?: string;
  continent?: string;
  continent_gid?: string;
  label?: string;
}
