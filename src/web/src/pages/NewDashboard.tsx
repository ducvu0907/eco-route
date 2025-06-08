import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DepotResponse, DispatchResponse, DispatchStatus, OrderResponse, OrderStatus, RouteResponse, RouteStatus, TrashCategory, VehicleResponse, VehicleStatus, VehicleType } from "@/types/types";
import { BatteryCharging, Clock, Package, Route as RouteIcon, Truck } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


// Mock Data Generation Functions
const generateMockDepots = (count: number): DepotResponse[] => {
  const depots: DepotResponse[] = [];
  for (let i = 0; i < count; i++) {
    depots.push({
      id: `depot-${i + 1}`,
      latitude: 10.762622 + (Math.random() - 0.5) * 0.1,
      longitude: 106.660172 + (Math.random() - 0.5) * 0.1,
      address: `Depot Address ${i + 1}`,
      vehicles: [], 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return depots;
};

const generateMockUsers = (count: number, role: 'DRIVER' | 'CUSTOMER' | 'MANAGER'): any[] => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: `${role.toLowerCase()}-${i + 1}`,
      username: `${role} User ${i + 1}`,
      phone: `+8412345678${i}`,
      role: role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return users;
};

const generateMockVehicles = (count: number, drivers: any[], depots: DepotResponse[]): VehicleResponse[] => {
  const vehicles: VehicleResponse[] = [];
  const vehicleTypes = Object.values(VehicleType);
  const trashCategories = Object.values(TrashCategory);
  const vehicleStatuses = Object.values(VehicleStatus);

  for (let i = 0; i < count; i++) {
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const depot = depots[Math.floor(Math.random() * depots.length)];

    const vehicle: VehicleResponse = {
      id: `vehicle-${i + 1}`,
      driver: driver,
      depotId: depot.id,
      licensePlate: `ABC-${Math.floor(100 + Math.random() * 900)}`,
      capacity: Math.floor(500 + Math.random() * 5000), // kg
      currentLatitude: depot.latitude + (Math.random() - 0.5) * 0.01,
      currentLongitude: depot.longitude + (Math.random() - 0.5) * 0.01,
      currentLoad: Math.floor(Math.random() * 500),
      type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      category: trashCategories[Math.floor(Math.random() * trashCategories.length)],
      status: vehicleStatuses[Math.floor(Math.random() * vehicleStatuses.length)],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    vehicles.push(vehicle);
    depot.vehicles.push(vehicle); // Add vehicle to depot
  }
  return vehicles;
};

const generateMockOrders = (count: number, customers: any[]): OrderResponse[] => {
  const orders: OrderResponse[] = [];
  const orderStatuses = Object.values(OrderStatus);
  const trashCategories = Object.values(TrashCategory);

  for (let i = 0; i < count; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const order: OrderResponse = {
      id: `order-${i + 1}`,
      index: i + 1,
      userId: customer.id,
      routeId: null,
      latitude: 10.762622 + (Math.random() - 0.5) * 0.1,
      longitude: 106.660172 + (Math.random() - 0.5) * 0.1,
      address: `Customer Address ${i + 1}`,
      imageUrl: Math.random() > 0.5 ? 'https://via.placeholder.com/150' : null,
      description: Math.random() > 0.3 ? `Trash description for order ${i + 1}` : null,
      category: trashCategories[Math.floor(Math.random() * trashCategories.length)],
      weight: Math.floor(10 + Math.random() * 100),
      status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
      completedAt: Math.random() > 0.5 ? new Date().toISOString() : null,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.push(order);
  }
  return orders;
};

const generateMockDispatches = (count: number): DispatchResponse[] => {
  const dispatches: DispatchResponse[] = [];
  const dispatchStatuses = Object.values(DispatchStatus);

  for (let i = 0; i < count; i++) {
    const dispatch: DispatchResponse = {
      id: `dispatch-${i + 1}`,
      status: dispatchStatuses[Math.floor(Math.random() * dispatchStatuses.length)],
      completedAt: Math.random() > 0.5 ? new Date().toISOString() : null,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatches.push(dispatch);
  }
  return dispatches;
};

const generateMockRoutes = (count: number, vehicles: VehicleResponse[], dispatches: DispatchResponse[], orders: OrderResponse[]): RouteResponse[] => {
  const routes: RouteResponse[] = [];
  const routeStatuses = Object.values(RouteStatus);

  for (let i = 0; i < count; i++) {
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    const dispatch = dispatches[Math.floor(Math.random() * dispatches.length)];
    const numOrders = Math.floor(1 + Math.random() * 5);
    const routeOrders: OrderResponse[] = [];
    for (let j = 0; j < numOrders; j++) {
      const order = orders[Math.floor(Math.random() * orders.length)];
      if (!routeOrders.some(o => o.id === order.id)) { // Avoid duplicate orders in a route for simplicity
        routeOrders.push({ ...order, routeId: `route-${i + 1}` }); // Assign routeId to order
      }
    }

    const route: RouteResponse = {
      id: `route-${i + 1}`,
      vehicle: vehicle,
      dispatchId: dispatch.id,
      distance: Math.floor(10 + Math.random() * 200), // km
      status: routeStatuses[Math.floor(Math.random() * routeStatuses.length)],
      orders: routeOrders,
      completedAt: Math.random() > 0.5 ? new Date().toISOString() : null,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      updatedAt: new Date().toISOString(),
      duration: Math.floor(30 + Math.random() * 300), // minutes
      coordinates: [[vehicle.currentLongitude, vehicle.currentLatitude]], // Start coordinate
    };

    // Add some random coordinates for the route path
    for (let j = 0; j < 5; j++) {
      route.coordinates.push([
        route.coordinates[0][0] + (Math.random() - 0.5) * 0.05,
        route.coordinates[0][1] + (Math.random() - 0.5) * 0.05,
      ]);
    }
    routes.push(route);
  }
  return routes;
};


// Main Dashboard Component
export default function NewDashboard() {
  const { t } = useTranslation();

  // real data
  // const { data: depotsData, isLoading: isDepotsLoading } = useGetDepots();
  // const { data: vehiclesData, isLoading: isVehiclesLoading } = useGetVehicles();
  // const { data: dispatchesData, isLoading: isDispatchesLoading } = useGetDispatches();
  // const { data: ordersData, isLoading: isOrdersLoading } = useGetOrders();
  // const {data: routesData, isLoading: isRoutesLoading} = useGetRoutes();

  // Mock data for development
  const mockCustomers = generateMockUsers(50, 'CUSTOMER');
  const mockDrivers = generateMockUsers(10, 'DRIVER');
  const mockDepots = generateMockDepots(3);
  const mockVehicles = generateMockVehicles(15, mockDrivers, mockDepots);
  const mockOrders = generateMockOrders(100, mockCustomers);
  const mockDispatches = generateMockDispatches(20);
  const mockRoutes = generateMockRoutes(30, mockVehicles, mockDispatches, mockOrders);

  const depots: DepotResponse[] = mockDepots; // Use mock data
  const vehicles: VehicleResponse[] = mockVehicles; // Use mock data
  const dispatches: DispatchResponse[] = mockDispatches; // Use mock data
  const orders: OrderResponse[] = mockOrders; // Use mock data
  const routes: RouteResponse[] = mockRoutes; // Use mock data


  // Set loading to false for mock data
  const isDepotsLoading = false;
  const isVehiclesLoading = false;
  const isDispatchesLoading = false;
  const isOrdersLoading = false;
  const isRoutesLoading = false;


  if (isDepotsLoading || isVehiclesLoading || isDispatchesLoading || isOrdersLoading || isRoutesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t("dashboard.Loading dashboard data...")}</p>
      </div>
    );
  }

  if (!depots || !vehicles || !orders || !dispatches || !routes) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>{t("dashboard.Failed to load dashboard data.")}</p>
      </div>
    );
  }

  // --- Dashboard Data Processing ---

  // Orders by Status
  const ordersByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<OrderStatus, number>);
  const ordersStatusChartData = Object.entries(ordersByStatus).map(([status, count]) => ({
    name: t(`dashboard.${status}`),
    value: count,
  }));

  // Orders by Category
  const ordersByCategory = orders.reduce((acc, order) => {
    acc[order.category] = (acc[order.category] || 0) + 1;
    return acc;
  }, {} as Record<TrashCategory, number>);
  const ordersCategoryChartData = Object.entries(ordersByCategory).map(([category, count]) => ({
    name: t(`dashboard.${category}`),
    value: count,
  }));


  // Vehicles by Status
  const vehiclesByStatus = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {} as Record<VehicleStatus, number>);
  const vehiclesStatusChartData = Object.entries(vehiclesByStatus).map(([status, count]) => ({
    name: t(`dashboard.${status}`),
    value: count,
  }));

  // Vehicles by Type
  const vehiclesByType = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.type] = (acc[vehicle.type] || 0) + 1;
    return acc;
  }, {} as Record<VehicleType, number>);
  const vehiclesTypeChartData = Object.entries(vehiclesByType).map(([type, count]) => ({
    name: t(`dashboard.${type}`),
    value: count,
  }));


  // Routes by Status
  const routesByStatus = routes.reduce((acc, route) => {
    acc[route.status] = (acc[route.status] || 0) + 1;
    return acc;
  }, {} as Record<RouteStatus, number>);
  const routesStatusChartData = Object.entries(routesByStatus).map(([status, count]) => ({
    name: t(`dashboard.${status}`),
    value: count,
  }));

  // Dispatches by Status
  const dispatchesByStatus = dispatches.reduce((acc, dispatch) => {
    acc[dispatch.status] = (acc[dispatch.status] || 0) + 1;
    return acc;
  }, {} as Record<DispatchStatus, number>);

  // const dispatchesStatusChartData = Object.entries(dispatchesByStatus).map(([status, count]) => ({
  //   name: t(`dashboard.${status}`),
  //   value: count,
  // }));

  // Total completed orders vs. total orders
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === OrderStatus.COMPLETED).length;
  const cancelledOrders = orders.filter(order => order.status === OrderStatus.CANCELLED).length;

  // const completedOrdersPercentage = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
  // const cancelledOrdersPercentage = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

  // Average Route Distance and Duration
  const totalRouteDistance = routes.reduce((sum, route) => sum + route.distance, 0);
  const averageRouteDistance = routes.length > 0 ? totalRouteDistance / routes.length : 0;

  const totalRouteDuration = routes.reduce((sum, route) => sum + route.duration, 0); // in minutes
  const averageRouteDuration = routes.length > 0 ? totalRouteDuration / routes.length : 0;

  // Total Orders per Route (Average)
  const totalOrdersInRoutes = routes.reduce((sum, route) => sum + route.orders.length, 0);
  const averageOrdersPerRoute = routes.length > 0 ? totalOrdersInRoutes / routes.length : 0;


  // Vehicle Load Percentage
  const vehicleLoadData = vehicles.map(vehicle => ({
    name: vehicle.licensePlate,
    loadPercentage: (vehicle.currentLoad / vehicle.capacity) * 100,
  }));


  // Top 5 depots by number of vehicles
  const depotsWithVehicleCount = depots.map(depot => ({
    ...depot,
    vehicleCount: vehicles.filter(v => v.depotId === depot.id).length
  })).sort((a, b) => b.vehicleCount - a.vehicleCount);
  const top5Depots = depotsWithVehicleCount.slice(0, 5);


  // Colors for Pie Charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0000', '#88FEE8'];


  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t("dashboard.Dashboard")}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.Total Orders")}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.Total trash collection requests")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.Active Vehicles")}</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vehicles.filter(v => v.status === VehicleStatus.ACTIVE).length} / {vehicles.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.Vehicles currently on duty")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.Completed Routes")}</CardTitle>
              <RouteIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {routes.filter(r => r.status === RouteStatus.COMPLETED).length} / {routes.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.Routes successfully finished")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.Active Dispatches")}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dispatches.filter(d => d.status === DispatchStatus.IN_PROGRESS).length} / {dispatches.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.Ongoing waste collection operations")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>{t("dashboard.Orders by Status")}</CardTitle>
              <CardDescription>{t("dashboard.Current distribution of all order statuses.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersStatusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>{t("dashboard.Orders by Trash Category")}</CardTitle>
              <CardDescription>{t("dashboard.Breakdown of orders based on trash type.")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ordersCategoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {ordersCategoryChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>{t("dashboard.Vehicle Status Overview")}</CardTitle>
              <CardDescription>{t("dashboard.Current operational status of all vehicles.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vehiclesStatusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>{t("dashboard.Vehicles by Type")}</CardTitle>
              <CardDescription>{t("dashboard.Distribution of vehicle types in the fleet.")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehiclesTypeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#82ca9d"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {vehiclesTypeChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* New Charts for Routes */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>{t("dashboard.Routes by Status")}</CardTitle>
              <CardDescription>{t("dashboard.Current distribution of all route statuses.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={routesStatusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>{t("dashboard.Order Completion/Cancellation Rate")}</CardTitle>
              <CardDescription>{t("dashboard.Percentage of completed and cancelled orders.")}</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ name: t('dashboard.Completed'), value: completedOrders }, { name: t('dashboard.Cancelled'), value: cancelledOrders }]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell key={`cell-completed`} fill={COLORS[0]} />
                    <Cell key={`cell-cancelled`} fill={COLORS[5]} />
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value} (${((value / totalOrders) * 100).toFixed(1)}%)`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>{t("dashboard.Average Route Performance")}</CardTitle>
              <CardDescription>{t("dashboard.Typical distance and duration of routes.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <RouteIcon className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-xl font-bold">{averageRouteDistance.toFixed(2)} km</div>
                    <p className="text-sm text-muted-foreground">{t("dashboard.Average Distance per Route")}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-xl font-bold">{averageRouteDuration.toFixed(2)} min</div>
                    <p className="text-sm text-muted-foreground">{t("dashboard.Average Duration per Route")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>{t("dashboard.Vehicle Load Status")}</CardTitle>
              <CardDescription>{t("dashboard.Current load percentage of vehicles.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] pr-4">
                {vehicleLoadData.map((data, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <BatteryCharging className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">{data.name}</div>
                      <Progress value={data.loadPercentage} className="h-2" />
                      <div className="text-xs text-muted-foreground">{data.loadPercentage.toFixed(1)}% {t("dashboard.full")}</div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Additional Route Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.Total Routes")}</CardTitle>
              <RouteIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{routes.length}</div>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.Total routes ever created")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.Routes in Progress")}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {routes.filter(r => r.status === RouteStatus.IN_PROGRESS).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.Routes currently being executed")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.Average Orders per Route")}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageOrdersPerRoute.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.Average number of orders in a route")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.Most Active Depot")}</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {top5Depots.length > 0 ? top5Depots[0].address : t("dashboard.N/A")}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.Depot with most vehicles")}{" "}
                {top5Depots.length > 0 && `(${top5Depots[0].vehicleCount} vehicles)`}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}