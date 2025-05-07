export interface ApiResponse<T> {
  code: string; // 00 - succeed, 99 - fail
  message: string;
  result: T | null;
}




// enums
export enum Role {
  CUSTOMER, 
  DRIVER, 
  MANAGER
}

export enum OrderStatus {
  PENDING,
  IN_PROGRESS,
  DONE,
  CANCELLED
}

export enum SubscriptionStatus {
  ACTIVE,
  CANCELLED
}

export enum VehicleStatus {
  IDLE,
  ACTIVE,
  REPAIR
}

export enum DispatchStatus {
  PLANNED,
  IN_PROGRESS,
  COMPLETED
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
  address: string | null;
}

export interface OrderCreateRequest {
  latitude: number;
  longitude: number;
  address: string | null;
  estimatedWeight: number;
}

export interface OrderUpdateRequest {
  status: OrderStatus;
}

export interface SubscriptionCreateRequest {
  latitude: number;
  longitude: number;
  address: string | null;
  estimatedWeight: number;
}

export interface VehicleCreateRequest {
  driverId: string;
  depotId: string;
  licensePlate: string;
  capacity: number;
}

export interface VehicleUpdateRequest {
  driverId: string;
  depotId: string;
  licensePlate: string;
  capacity: number;
}






// responses
export interface AuthResponse {
  token: string;
}

export interface DepotResponse {
  id: string;
  latitude: number;
  longitude: number;
  address: string | null;
  vehicles: VehicleResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface DispatchResponse {
  id: string;
  startTime: string | null;
  endTime: string | null;
  status: DispatchStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NodeResponse {
  id: string;
  sequenceNumber: number;
  routeId: string;
  orderId: string | null;
  subscriptionId: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  estimatedWeight: number;
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
  userId: string;
  latitude: number;
  longitude: number;
  address: string | null;
  estimatedWeight: number;
  status: OrderStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OsmResponse {
  placeId?: number;
  licence?: string;
  osmType?: string;
  osmId?: number;
  lat?: string;
  lon?: string;
  classType?: string;
  type?: string;
  placeRank?: number;
  importance?: number;
  addresstype?: string;
  name?: string;
  displayName?: string;
  boundingbox?: string[];
  error?: string; // if there's not field error then it succeeds
}

export interface RouteResponse {
  id: string;
  vehicleId: string;
  dispatchId: string;
  totalDistance: number;
  nodes: NodeResponse[];
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionResponse {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  address: string | null;
  estimatedWeight: number;
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
  driverId: string;
  depotId: string;
  licensePlate: string;
  capacity: number;
  currentLatitude: number | null;
  currentLongitude: number | null;
  currentLoad: number | null;
  status: VehicleStatus;
  createdAt: string;
  updatedAt: string;
}
