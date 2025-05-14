import SingleRouteMap from "@/components/map/SingleRouteStaticMap";
import { RouteResponse, VehicleStatus, Role, OrderStatus, RouteStatus } from "@/types/types";

const mockRoute: RouteResponse = {
  id: "route-123",
  dispatchId: "dispatch-456",
  distance: 12.5,
  status: RouteStatus.IN_PROGRESS,
  completedAt: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  vehicle: {
    id: "vehicle-789",
    depotId: "depot-001",
    licensePlate: "XYZ-1234",
    capacity: 1000,
    currentLatitude: 37.7759,
    currentLongitude: -122.4194,
    currentLoad: 350,
    status: VehicleStatus.ACTIVE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    driver: {
      id: "user-001",
      username: "driver_john",
      phone: "+1234567890",
      role: Role.DRIVER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  orders: [
    {
      id: "order-1",
      index: 1,
      userId: "customer-001",
      routeId: "route-123",
      latitude: 37.7749,
      longitude: -122.4194,
      address: "1 Market St, San Francisco, CA",
      weight: 100,
      status: OrderStatus.PENDING,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "order-2",
      index: 2,
      userId: "customer-002",
      routeId: "route-123",
      latitude: 37.7849,
      longitude: -122.4094,
      address: "200 Mission St, San Francisco, CA",
      weight: 120,
      status: OrderStatus.PENDING,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "order-3",
      index: 3,
      userId: "customer-003",
      routeId: "route-123",
      latitude: 37.7949,
      longitude: -122.3994,
      address: "300 Howard St, San Francisco, CA",
      weight: 130,
      status: OrderStatus.PENDING,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

export default function MockRouteMapPreview() {
  return (
    <div className="p-6">
      <SingleRouteMap route={mockRoute} />
    </div>
  );
}
