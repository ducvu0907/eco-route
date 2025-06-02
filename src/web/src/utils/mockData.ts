import { UserResponse, Role, DepotResponse, DispatchResponse, DispatchStatus, OrderResponse, OrderStatus, RouteResponse, RouteStatus, TrashCategory, VehicleResponse, VehicleStatus, VehicleType } from "@/types/types";

const mockUsers: UserResponse[] = [
  {
    id: '1',
    username: 'John Doe',
    phone: '+84901234567',
    role: Role.DRIVER,
    createdAt: '2025-05-30T08:00:00Z',
    updatedAt: '2025-05-30T08:00:00Z'
  },
  {
    id: '2',
    username: 'Jane Smith',
    phone: '+84901234568',
    role: Role.DRIVER,
    createdAt: '2025-05-30T08:00:00Z',
    updatedAt: '2025-05-30T08:00:00Z'
  },
  {
    id: '3',
    username: 'Mike Johnson',
    phone: '+84901234569',
    role: Role.DRIVER,
    createdAt: '2025-05-30T08:00:00Z',
    updatedAt: '2025-05-30T08:00:00Z'
  },
  {
    id: '4',
    username: 'Sarah Wilson',
    phone: '+84901234570',
    role: Role.CUSTOMER,
    createdAt: '2025-05-30T08:00:00Z',
    updatedAt: '2025-05-30T08:00:00Z'
  }
];

const mockVehicles: VehicleResponse[] = [
  {
    id: '1',
    driver: mockUsers[0],
    depotId: '1',
    licensePlate: 'HN-001-23',
    capacity: 1000,
    currentLatitude: 21.0285,
    currentLongitude: 105.8542,
    currentLoad: 750,
    type: VehicleType.COMPACTOR_TRUCK,
    category: TrashCategory.GENERAL,
    status: VehicleStatus.ACTIVE,
    createdAt: '2025-05-30T08:00:00Z',
    updatedAt: '2025-05-31T08:00:00Z'
  },
  {
    id: '2',
    driver: mockUsers[1],
    depotId: '1',
    licensePlate: 'HN-002-23',
    capacity: 500,
    currentLatitude: 21.0368,
    currentLongitude: 105.8348,
    currentLoad: 150,
    type: VehicleType.THREE_WHEELER,
    category: TrashCategory.RECYCLABLE,
    status: VehicleStatus.IDLE,
    createdAt: '2025-05-30T08:00:00Z',
    updatedAt: '2025-05-31T08:00:00Z'
  },
  {
    id: '3',
    driver: mockUsers[2],
    depotId: '2',
    licensePlate: 'HN-003-23',
    capacity: 1000,
    currentLatitude: 21.0200,
    currentLongitude: 105.8400,
    currentLoad: 0,
    type: VehicleType.COMPACTOR_TRUCK,
    category: TrashCategory.ORGANIC,
    status: VehicleStatus.REPAIR,
    createdAt: '2025-05-30T08:00:00Z',
    updatedAt: '2025-05-31T08:00:00Z'
  }
];

const mockOrders: OrderResponse[] = [
  {
    id: '1',
    index: 1,
    userId: '4',
    routeId: '1',
    latitude: 21.0285,
    longitude: 105.8542,
    address: '123 Hang Bong Street, Hoan Kiem, Hanoi',
    imageUrl: null,
    description: 'Household waste collection',
    category: TrashCategory.GENERAL,
    weight: 15,
    status: OrderStatus.PENDING,
    completedAt: null,
    createdAt: '2025-05-31T08:00:00Z',
    updatedAt: '2025-05-31T08:00:00Z'
  },
  {
    id: '2',
    index: 2,
    userId: '4',
    routeId: '1',
    latitude: 21.0368,
    longitude: 105.8348,
    address: '456 Ba Trieu Street, Hai Ba Trung, Hanoi',
    imageUrl: null,
    description: 'Recyclable materials',
    category: TrashCategory.RECYCLABLE,
    weight: 8,
    status: OrderStatus.IN_PROGRESS,
    completedAt: null,
    createdAt: '2025-05-31T07:30:00Z',
    updatedAt: '2025-05-31T09:00:00Z'
  },
  {
    id: '3',
    index: null,
    userId: '4',
    routeId: null,
    latitude: 21.0200,
    longitude: 105.8400,
    address: '789 Le Duan Street, Dong Da, Hanoi',
    imageUrl: null,
    description: 'Food waste and organic materials',
    category: TrashCategory.ORGANIC,
    weight: 12,
    status: OrderStatus.COMPLETED,
    completedAt: '2025-05-31T06:30:00Z',
    createdAt: '2025-05-31T06:00:00Z',
    updatedAt: '2025-05-31T06:30:00Z'
  },
  {
    id: '4',
    index: null,
    userId: '4',
    routeId: null,
    latitude: 21.0150,
    longitude: 105.8300,
    address: '321 Tran Hung Dao Street, Hoan Kiem, Hanoi',
    imageUrl: null,
    description: 'Hazardous waste - batteries and chemicals',
    category: TrashCategory.HAZARDOUS,
    weight: 5,
    status: OrderStatus.PENDING,
    completedAt: null,
    createdAt: '2025-05-31T09:00:00Z',
    updatedAt: '2025-05-31T09:00:00Z'
  },
  {
    id: '5',
    index: null,
    userId: '4',
    routeId: null,
    latitude: 21.0300,
    longitude: 105.8500,
    address: '654 Nguyen Du Street, Hai Ba Trung, Hanoi',
    imageUrl: null,
    description: 'Old electronics and computer parts',
    category: TrashCategory.ELECTRONIC,
    weight: 20,
    status: OrderStatus.COMPLETED,
    completedAt: '2025-05-31T05:45:00Z',
    createdAt: '2025-05-31T05:30:00Z',
    updatedAt: '2025-05-31T05:45:00Z'
  },
  {
    id: '6',
    index: null,
    userId: '4',
    routeId: null,
    latitude: 21.0250,
    longitude: 105.8450,
    address: '987 Pham Ngu Lao Street, Hoan Kiem, Hanoi',
    imageUrl: null,
    description: 'Mixed household waste',
    category: TrashCategory.GENERAL,
    weight: 25,
    status: OrderStatus.COMPLETED,
    completedAt: '2025-05-30T14:30:00Z',
    createdAt: '2025-05-30T14:00:00Z',
    updatedAt: '2025-05-30T14:30:00Z'
  },
  {
    id: '7',
    index: null,
    userId: '4',
    routeId: null,
    latitude: 21.0180,
    longitude: 105.8380,
    address: '147 Dong Khoi Street, Dong Da, Hanoi',
    imageUrl: null,
    description: 'Paper and plastic recyclables',
    category: TrashCategory.RECYCLABLE,
    weight: 18,
    status: OrderStatus.COMPLETED,
    completedAt: '2025-05-30T16:45:00Z',
    createdAt: '2025-05-30T16:30:00Z',
    updatedAt: '2025-05-30T16:45:00Z'
  }
];

const mockRoutes: RouteResponse[] = [
  {
    id: '1',
    vehicle: mockVehicles[0],
    dispatchId: '1',
    distance: 25.5,
    status: RouteStatus.IN_PROGRESS,
    orders: [mockOrders[0], mockOrders[1]],
    completedAt: '',
    createdAt: '2025-05-31T08:00:00Z',
    updatedAt: '2025-05-31T09:00:00Z',
    duration: 120,
    coordinates: [[21.0285, 105.8542], [21.0368, 105.8348], [21.0300, 105.8400]]
  },
  {
    id: '2',
    vehicle: mockVehicles[1],
    dispatchId: '2',
    distance: 18.2,
    status: RouteStatus.COMPLETED,
    orders: [mockOrders[2]],
    completedAt: '2025-05-31T06:30:00Z',
    createdAt: '2025-05-31T06:00:00Z',
    updatedAt: '2025-05-31T06:30:00Z',
    duration: 90,
    coordinates: [[21.0200, 105.8400], [21.0250, 105.8450]]
  },
  {
    id: '3',
    vehicle: mockVehicles[2],
    dispatchId: '2',
    distance: 32.1,
    status: RouteStatus.COMPLETED,
    orders: [mockOrders[4], mockOrders[5], mockOrders[6]],
    completedAt: '2025-05-30T17:00:00Z',
    createdAt: '2025-05-30T14:00:00Z',
    updatedAt: '2025-05-30T17:00:00Z',
    duration: 150,
    coordinates: [[21.0300, 105.8500], [21.0250, 105.8450], [21.0180, 105.8380]]
  }
];

const mockDepots: DepotResponse[] = [
  {
    id: '1',
    latitude: 21.0285,
    longitude: 105.8542,
    address: 'Central Depot - 15 Hang Bong Street, Hoan Kiem District, Hanoi',
    vehicles: [mockVehicles[0], mockVehicles[1]],
    createdAt: '2025-05-30T08:00:00Z',
    updatedAt: '2025-05-30T08:00:00Z'
  },
  {
    id: '2',
    latitude: 21.0368,
    longitude: 105.8348,
    address: 'North Station Hub - 25 Tran Hung Dao Street, Ba Dinh District, Hanoi',
    vehicles: [mockVehicles[2]],
    createdAt: '2025-05-30T08:00:00Z',
    updatedAt: '2025-05-30T08:00:00Z'
  }
];

const mockDispatches: DispatchResponse[] = [
  {
    id: '1',
    status: DispatchStatus.IN_PROGRESS,
    completedAt: '',
    createdAt: '2025-05-31T08:00:00Z',
    updatedAt: '2025-05-31T09:00:00Z'
  },
  {
    id: '2',
    status: DispatchStatus.COMPLETED,
    completedAt: '2025-05-31T06:30:00Z',
    createdAt: '2025-05-31T06:00:00Z',
    updatedAt: '2025-05-31T06:30:00Z'
  }
];

// Extend Users
for (let i = 5; i <= 15; i++) {
  mockUsers.push({
    id: i.toString(),
    username: `User ${i}`,
    phone: `+84901234${i.toString().padStart(3, '0')}`,
    role: i % 3 === 0 ? Role.CUSTOMER : Role.DRIVER,
    createdAt: '2025-05-30T08:00:00Z',
    updatedAt: '2025-05-30T08:00:00Z'
  });
}

// Extend Vehicles
for (let i = 4; i <= 13; i++) {
  mockVehicles.push({
    id: i.toString(),
    driver: mockUsers[i % mockUsers.length],
    depotId: (i % 3 + 1).toString(),
    licensePlate: `HN-00${i}-23`,
    capacity: 500 + (i % 3) * 250,
    currentLatitude: 21.02 + Math.random() * 0.02,
    currentLongitude: 105.83 + Math.random() * 0.02,
    currentLoad: Math.floor(Math.random() * 500),
    type: Object.values(VehicleType)[i % Object.keys(VehicleType).length],
    category: Object.values(TrashCategory)[i % Object.keys(TrashCategory).length],
    status: Object.values(VehicleStatus)[i % Object.keys(VehicleStatus).length],
    createdAt: '2025-05-30T08:00:00Z',
    updatedAt: '2025-05-31T08:00:00Z'
  });
}

// Extend Orders
for (let i = 8; i <= 38; i++) {
  const category = Object.values(TrashCategory)[i % Object.keys(TrashCategory).length];
  const status = Object.values(OrderStatus)[i % Object.keys(OrderStatus).length];
  mockOrders.push({
    id: i.toString(),
    index: i <= 20 ? i : null,
    userId: '4',
    routeId: i <= 20 ? (1 + (i % 5)).toString() : null,
    latitude: 21.01 + Math.random() * 0.03,
    longitude: 105.83 + Math.random() * 0.03,
    address: `Mock Address ${i}, Hanoi`,
    imageUrl: null,
    description: `${category} waste example ${i}`,
    category,
    weight: Math.floor(Math.random() * 30) + 5,
    status,
    completedAt: status === OrderStatus.COMPLETED ? '2025-05-31T10:00:00Z' : null,
    createdAt: '2025-05-31T08:00:00Z',
    updatedAt: '2025-05-31T09:00:00Z'
  });
}

// Extend Routes
for (let i = 4; i <= 10; i++) {
  const ordersInRoute = mockOrders.slice(i * 2, i * 2 + 2);
  const coordinates = ordersInRoute.map(o => [o.latitude, o.longitude]);
  mockRoutes.push({
    id: i.toString(),
    vehicle: mockVehicles[i % mockVehicles.length],
    dispatchId: (i % 5 + 1).toString(),
    distance: parseFloat((10 + i * 2).toFixed(1)),
    status: i % 2 === 0 ? RouteStatus.IN_PROGRESS : RouteStatus.COMPLETED,
    orders: ordersInRoute,
    completedAt: i % 2 === 0 ? '' : '2025-05-31T10:00:00Z',
    createdAt: '2025-05-31T08:00:00Z',
    updatedAt: '2025-05-31T09:00:00Z',
    duration: 60 + i * 10,
    coordinates
  });
}

// Extend Depots
for (let i = 3; i <= 5; i++) {
  mockDepots.push({
    id: i.toString(),
    latitude: 21.01 + i * 0.01,
    longitude: 105.83 + i * 0.01,
    address: `Depot ${i} - Address ${i}, Hanoi`,
    vehicles: mockVehicles.filter((_, index) => index % 3 === i % 3),
    createdAt: '2025-05-30T08:00:00Z',
    updatedAt: '2025-05-30T08:00:00Z'
  });
}

// Extend Dispatches
for (let i = 3; i <= 7; i++) {
  const isCompleted = i % 2 === 0;
  mockDispatches.push({
    id: i.toString(),
    status: isCompleted ? DispatchStatus.COMPLETED : DispatchStatus.IN_PROGRESS,
    completedAt: isCompleted ? '2025-05-31T10:00:00Z' : '',
    createdAt: '2025-05-31T08:00:00Z',
    updatedAt: '2025-05-31T09:00:00Z'
  });
}

export type DashboardData = {
  depots: DepotResponse[],
  vehicles: VehicleResponse[],
  orders: OrderResponse[],
  routes: RouteResponse[],
  dispatches: DispatchResponse[],
};

const mockData: DashboardData = {
  depots: mockDepots,
  vehicles: mockVehicles,
  orders: mockOrders,
  routes: mockRoutes,
  dispatches: mockDispatches
};

export default mockData;