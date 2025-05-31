// import { useGetDepots } from "@/hooks/useDepot";
// import { useGetDispatches } from "@/hooks/useDispatch";
// import { useGetOrders } from "@/hooks/useOrder";
// import { useGetRoutes } from "@/hooks/useRoute";
// import { useGetVehicles } from "@/hooks/useVehicle";

// export default function Dashboard() {
//   const { data: depotsData } = useGetDepots();
//   const depots = depotsData?.result;
//   const { data: vehiclesData } = useGetVehicles();
//   const vehicles = vehiclesData?.result;
//   const { data: dispatchesData } = useGetDispatches();
//   const dispatches = dispatchesData?.result;
//   const { data: ordersData } = useGetOrders();
//   const orders = ordersData?.result;
//   const {data: routesData} = useGetRoutes();
//   const routes = routesData?.result;

//   return (
//     <div>Dashboard</div>
//   );
// }

import React from 'react';
import { 
  Truck, 
  MapPin, 
  Package, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Route,
  Zap,
  Recycle,
  Trash2,
  Battery,
  Globe,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Pie
} from 'recharts';
import { DepotResponse, DispatchResponse, DispatchStatus, OrderResponse, OrderStatus, Role, RouteResponse, RouteStatus, TrashCategory, UserResponse, VehicleResponse, VehicleStatus, VehicleType } from '@/types/types';

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

const mockData = {
  depots: mockDepots,
  vehicles: mockVehicles,
  orders: mockOrders,
  routes: mockRoutes,
  dispatches: mockDispatches
};

// Chart data generation
const generateDailyOrdersData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    completed: Math.floor(Math.random() * 20) + 10,
    pending: Math.floor(Math.random() * 15) + 5,
    inProgress: Math.floor(Math.random() * 10) + 3,
  }));
};

const generateRouteEfficiencyData = () => {
  return mockData.routes.map((route, index) => ({
    route: `Route ${route.id}`,
    efficiency: Math.round(((route.orders.length * 100) / route.distance) * 10) / 10, // Orders per km efficiency
    distance: route.distance,
    duration: route.duration,
    fuel: Math.round((route.distance * 0.4) * 10) / 10, // Estimated fuel consumption
    orders: route.orders.length
  }));
};

const generateDispatchHourlyData = () => {
  const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
  return hours.map(hour => ({
    hour,
    dispatches: Math.floor(Math.random() * 4) + 1,
    vehicles: Math.floor(Math.random() * 8) + 3,
    completedOrders: Math.floor(Math.random() * 15) + 5
  }));
};

const generateWasteCategoryData = () => {
  const categories = ['GENERAL', 'RECYCLABLE', 'ORGANIC', 'HAZARDOUS', 'ELECTRONIC'];
  return categories.map(category => {
    const categoryOrders = mockData.orders.filter(o => o.category === category);
    const weight = categoryOrders.reduce((sum, o) => sum + o.weight, 0);
    return {
      category: category.toLowerCase(),
      weight,
      orders: categoryOrders.length,
      percentage: ((weight / mockData.orders.reduce((sum, o) => sum + o.weight, 0)) * 100).toFixed(1)
    };
  });
};

const generateVehicleUtilizationData = () => {
  return mockData.vehicles.map(vehicle => ({
    vehicle: vehicle.licensePlate,
    utilization: Math.round((vehicle.currentLoad / vehicle.capacity) * 100),
    capacity: vehicle.capacity,
    load: vehicle.currentLoad,
    status: vehicle.status,
    fill: STATUS_COLORS[vehicle.status] || '#8884D8'
  }));
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
const STATUS_COLORS = {
  ACTIVE: '#10B981',
  IDLE: '#3B82F6', 
  REPAIR: '#EF4444'
};

export default function Dashboard() {
  const totalOrders = mockData.orders.length;
  const completedOrders = mockData.orders.filter(o => o.status === 'COMPLETED').length;
  const pendingOrders = mockData.orders.filter(o => o.status === 'PENDING').length;
  const inProgressOrders = mockData.orders.filter(o => o.status === 'IN_PROGRESS').length;
  
  const activeVehicles = mockData.vehicles.filter(v => v.status === 'ACTIVE').length;
  const idleVehicles = mockData.vehicles.filter(v => v.status === 'IDLE').length;
  const repairVehicles = mockData.vehicles.filter(v => v.status === 'REPAIR').length;
  
  const activeRoutes = mockData.routes.filter(r => r.status === 'IN_PROGRESS').length;
  const completedRoutes = mockData.routes.filter(r => r.status === 'COMPLETED').length;
  
  const totalWeight = mockData.orders.reduce((sum, order) => sum + order.weight, 0);
  
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  // Chart data
  const dailyOrdersData = generateDailyOrdersData();
  const routeEfficiencyData = generateRouteEfficiencyData();
  const dispatchHourlyData = generateDispatchHourlyData();
  const wasteCategoryData = generateWasteCategoryData();
  const vehicleUtilizationData = generateVehicleUtilizationData();

  const getStatusColor = (status: VehicleStatus | RouteStatus | OrderStatus) => {
    switch (status) {
      case 'ACTIVE':
      case 'IN_PROGRESS':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IDLE':
        return 'bg-blue-100 text-blue-800';
      case 'REPAIR':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: TrashCategory) => {
    switch (category) {
      case 'RECYCLABLE':
        return <Recycle className="h-4 w-4" />;
      case 'ORGANIC':
        return <Globe className="h-4 w-4" />;
      case 'HAZARDOUS':
        return <AlertCircle className="h-4 w-4" />;
      case 'ELECTRONIC':
        return <Zap className="h-4 w-4" />;
      default:
        return <Trash2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your fleet, orders, and operations in real-time</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{completedOrders} completed</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeVehicles}</div>
              <p className="text-xs text-muted-foreground">
                {idleVehicles} idle, {repairVehicles} in repair
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
              <Battery className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWeight} kg</div>
              <p className="text-xs text-muted-foreground">
                Collected today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Orders Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Daily Orders Trend
              </CardTitle>
              <CardDescription>Order status distribution over the week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyOrdersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="completed" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="pending" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.8} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Route Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Route Efficiency Analysis
              </CardTitle>
              <CardDescription>Efficiency vs Distance for active routes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={routeEfficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="route" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="efficiency" fill="#8884d8" name="Efficiency %" />
                  <Bar yAxisId="right" dataKey="distance" fill="#82ca9d" name="Distance (km)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Dispatch Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Hourly Dispatch Activity
              </CardTitle>
              <CardDescription>Dispatch frequency and vehicle allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dispatchHourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="dispatches" stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} />
                  <Line type="monotone" dataKey="vehicles" stroke="#82ca9d" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Waste Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Waste Category Distribution
              </CardTitle>
              <CardDescription>Weight distribution by waste type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    dataKey="weight"
                    data={wasteCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {wasteCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} kg`, 'Weight']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Vehicle Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Vehicle Load Utilization
              </CardTitle>
              <CardDescription>Current load capacity utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={vehicleUtilizationData}>
                  <RadialBar 
                    // minAngle={15} 
                    label={{ position: 'insideStart', fill: '#fff' }} 
                    background 
                    // clockWise 
                    dataKey="utilization" 
                  />
                  <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                  {/* <Legend iconSize={18} layout="horizontal" verticalAlign="bottom" wrapperStyle={{ paddingLeft: '20px' }} /> */}
                </RadialBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Route Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Route Performance Metrics
              </CardTitle>
              <CardDescription>Fuel consumption vs route efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={routeEfficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="route" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="fuel" stroke="#ff7300" strokeWidth={3} name="Fuel (L)" />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#387908" strokeWidth={3} name="Efficiency %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Status
              </CardTitle>
              <CardDescription>Current order distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{pendingOrders}</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {((pendingOrders / totalOrders) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{inProgressOrders}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {((inProgressOrders / totalOrders) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{completedOrders}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {((completedOrders / totalOrders) * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Fleet */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Fleet Status
              </CardTitle>
              <CardDescription>Vehicle availability and load</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[300px] overflow-auto">
              {mockData.vehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{vehicle.licensePlate}</span>
                      <Badge className={`text-xs ${getStatusColor(vehicle.status)}`}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{vehicle.driver.username}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {vehicle.currentLoad}/{vehicle.capacity} kg
                    </div>
                    <Progress 
                      value={(vehicle.currentLoad / vehicle.capacity) * 100} 
                      className="w-16 h-2 mt-1"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Waste Categories
              </CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from(new Set(mockData.orders.map(o => o.category))).map((category) => {
                const categoryOrders = mockData.orders.filter(o => o.category === category);
                const categoryWeight = categoryOrders.reduce((sum, o) => sum + o.weight, 0);
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      <span className="text-sm capitalize">{category.toLowerCase()}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{categoryWeight} kg</div>
                      <div className="text-xs text-gray-500">{categoryOrders.length} orders</div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Routes and Depots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Active Routes
              </CardTitle>
              <CardDescription>Current route operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[500px] overflow-auto">
              {mockData.routes.map((route) => (
                <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Route #{route.id}</span>
                      <Badge className={getStatusColor(route.status)}>
                        {route.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {route.orders.length} stops • {route.distance} km • {route.vehicle.licensePlate}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{route.duration} min</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Depot Locations
              </CardTitle>
              <CardDescription>Collection and storage facilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[500px] overflow-auto">
              {mockData.depots.map((depot) => (
                <div key={depot.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{depot.address}</div>
                    <p className="text-sm text-gray-600 mt-1">
                      {depot.latitude.toFixed(4)}, {depot.longitude.toFixed(4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{mockData.vehicles.length}</div>
                    <div className="text-xs text-gray-500">Vehicles</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}