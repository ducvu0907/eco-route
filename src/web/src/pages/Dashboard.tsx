import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Progress } from '@/components/ui/progress';
import { useGetDepots } from '@/hooks/useDepot';
import { useGetDispatches } from '@/hooks/useDispatch';
import { useGetOrders } from '@/hooks/useOrder';
import { useGetRoutes } from '@/hooks/useRoute';
import { useGetVehicles } from '@/hooks/useVehicle';
import { DispatchStatus, OrderStatus, RouteStatus, TrashCategory, VehicleStatus } from '@/types/types';
import { COLORS, generateDailyOrdersData, generateDispatchHourlyData, generateRouteEfficiencyData, generateVehicleUtilizationData, generateWasteCategoryData } from '@/utils/dashboardUtils';
import mockData, { DashboardData } from '@/utils/mockData';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Battery,
  CheckCircle,
  Clock,
  Globe,
  MapPin,
  Package,
  PieChart,
  Recycle,
  Route,
  Trash2,
  TrendingUp,
  Truck,
  Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  RadialBar,
  RadialBarChart,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: depotsData, isLoading: isDepotsLoading } = useGetDepots();
  const depots = depotsData?.result;
  const { data: vehiclesData, isLoading: isVehiclesLoading } = useGetVehicles();
  const vehicles = vehiclesData?.result;
  const { data: dispatchesData, isLoading: isDispatchesLoading } = useGetDispatches();
  const dispatches = dispatchesData?.result;
  const { data: ordersData, isLoading: isOrdersLoading } = useGetOrders();
  const orders = ordersData?.result;
  const {data: routesData, isLoading: isRoutesLoading} = useGetRoutes();
  const routes = routesData?.result;

  if (isDepotsLoading || isVehiclesLoading || isDispatchesLoading || isOrdersLoading || isRoutesLoading) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <LoadingSpinner className='w-20 h-20'/>
      </div>
    );
  }

  if (!depots || !vehicles || !orders || !dispatches || !routes) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        <span>Errors while loading data. Please try again later</span>
      </div>
    );
  }

  const data: DashboardData = {
    depots,
    vehicles,
    orders,
    dispatches,
    routes 
  }

  const totalOrders = data.orders.length;
  const completedOrders = data.orders.filter(o => o.status === OrderStatus.COMPLETED).length;
  const pendingOrders = data.orders.filter(o => o.status === OrderStatus.PENDING).length;
  const inProgressOrders = data.orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length;
  
  const activeVehicles = data.vehicles.filter(v => v.status === VehicleStatus.ACTIVE).length;
  const idleVehicles = data.vehicles.filter(v => v.status === VehicleStatus.IDLE).length;
  const repairVehicles = data.vehicles.filter(v => v.status === VehicleStatus.REPAIR).length;
  
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

  // Chart data
  const dailyOrdersData = generateDailyOrdersData();
  const routeEfficiencyData = generateRouteEfficiencyData(data.routes);
  const dispatchHourlyData = generateDispatchHourlyData();
  const wasteCategoryData = generateWasteCategoryData();
  const vehicleUtilizationData = generateVehicleUtilizationData(data.vehicles);

  const getStatusColor = (status: VehicleStatus | RouteStatus | OrderStatus | DispatchStatus) => {
    switch (status) {
      case VehicleStatus.ACTIVE:
      case OrderStatus.IN_PROGRESS:
      case OrderStatus.COMPLETED:
      case RouteStatus.IN_PROGRESS:
      case RouteStatus.COMPLETED:
      case DispatchStatus.IN_PROGRESS:
      case DispatchStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case VehicleStatus.IDLE:
        return 'bg-blue-100 text-blue-800';
      case VehicleStatus.REPAIR:
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: TrashCategory) => {
    switch (category) {
      case TrashCategory.RECYCLABLE:
        return <Recycle className="h-4 w-4" />;
      case TrashCategory.ORGANIC:
        return <Globe className="h-4 w-4" />;
      case TrashCategory.HAZARDOUS:
        return <AlertCircle className="h-4 w-4" />;
      case TrashCategory.ELECTRONIC:
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
          <h1 className="text-3xl font-bold text-gray-900">{t("dashboard.header.title")}</h1>
          <p className="text-gray-600 mt-2">{t("dashboard.header.subtitle")}</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.keyMetrics.totalOrders.title")}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{t("dashboard.keyMetrics.totalOrders.completedText", { count: completedOrders })}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.keyMetrics.activeVehicles.title")}</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeVehicles}</div>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.keyMetrics.activeVehicles.idleText", { idleCount: idleVehicles })}, {t("dashboard.keyMetrics.activeVehicles.repairText", { repairCount: repairVehicles })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.keyMetrics.completionRate.title")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.keyMetrics.totalWeight.title")}</CardTitle>
              <Battery className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.orders.reduce((sum, order) => sum + order.weight, 0)} {t("dashboard.keyMetrics.totalWeight.unit")}</div>
              <p className="text-xs text-muted-foreground">
                {t("dashboard.keyMetrics.totalWeight.description")}
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
                {t("dashboard.chartsSection.dailyOrdersTrend.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.chartsSection.dailyOrdersTrend.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyOrdersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey={t("dashboard.chartsSection.dailyOrdersTrend.completedLabel")} stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.8} />
                  <Area type="monotone" dataKey={t("dashboard.chartsSection.dailyOrdersTrend.inProgressLabel")} stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.8} />
                  <Area type="monotone" dataKey={t("dashboard.chartsSection.dailyOrdersTrend.pendingLabel")} stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.8} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Route Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                {t("dashboard.chartsSection.routeEfficiencyAnalysis.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.chartsSection.routeEfficiencyAnalysis.description")}</CardDescription>
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
                  <Bar yAxisId="left" dataKey="efficiency" fill="#8884d8" name={t("dashboard.chartsSection.routeEfficiencyAnalysis.efficiencyLabel")} />
                  <Bar yAxisId="right" dataKey="distance" fill="#82ca9d" name={t("dashboard.chartsSection.routeEfficiencyAnalysis.distanceLabel")} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Dispatch Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {t("dashboard.chartsSection.hourlyDispatchActivity.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.chartsSection.hourlyDispatchActivity.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dispatchHourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey={t("dashboard.chartsSection.hourlyDispatchActivity.dispatchesLabel")} stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} />
                  <Line type="monotone" dataKey={t("dashboard.chartsSection.hourlyDispatchActivity.vehiclesLabel")} stroke="#82ca9d" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Waste Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                {t("dashboard.chartsSection.wasteCategoryDistribution.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.chartsSection.wasteCategoryDistribution.description")}</CardDescription>
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
                    label={({ category, percentage }) => `${t(`dashboard.categories.${category}`)}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {wasteCategoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ${t("dashboard.keyMetrics.totalWeight.unit")}`, t("dashboard.chartsSection.wasteCategoryDistribution.tooltipWeight")]} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Vehicle Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {t("dashboard.chartsSection.vehicleLoadUtilization.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.chartsSection.vehicleLoadUtilization.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" data={vehicleUtilizationData}>
                  <RadialBar 
                    label={{ position: 'insideStart', fill: '#fff' }} 
                    background 
                    dataKey="utilization" 
                  />
                  <Tooltip formatter={(value) => [`${value}%`, t("dashboard.chartsSection.vehicleLoadUtilization.tooltipUtilization")]} />
                </RadialBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Route Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t("dashboard.chartsSection.routePerformanceMetrics.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.chartsSection.routePerformanceMetrics.description")}</CardDescription>
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
                  <Line yAxisId="left" type="monotone" dataKey="fuel" stroke="#ff7300" strokeWidth={3} name={t("dashboard.chartsSection.routePerformanceMetrics.fuelLabel")} />
                  <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#387908" strokeWidth={3} name={t("dashboard.chartsSection.routePerformanceMetrics.efficiencyLabel")} />
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
                {t("dashboard.mainContentGrid.orderStatus.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.mainContentGrid.orderStatus.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{t("dashboard.mainContentGrid.orderStatus.pending")}</span>
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
                  <span className="text-sm">{t("dashboard.mainContentGrid.orderStatus.inProgress")}</span>
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
                  <span className="text-sm">{t("dashboard.mainContentGrid.orderStatus.completed")}</span>
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
                {t("dashboard.mainContentGrid.fleetStatus.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.mainContentGrid.fleetStatus.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[300px] overflow-auto">
              {mockData.vehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{vehicle.licensePlate}</span>
                      <Badge className={`text-xs ${getStatusColor(vehicle.status)}`}>
                        {t(`dashboard.statuses.${vehicle.status}`)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{vehicle.driver.username}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {vehicle.currentLoad}/{vehicle.capacity} {t("dashboard.keyMetrics.totalWeight.unit")}
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
                {t("dashboard.mainContentGrid.wasteCategories.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.mainContentGrid.wasteCategories.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from(new Set(mockData.orders.map(o => o.category))).map((category) => {
                const categoryOrders = mockData.orders.filter(o => o.category === category);
                const categoryWeight = categoryOrders.reduce((sum, o) => sum + o.weight, 0);
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      <span className="text-sm capitalize">{t(`dashboard.categories.${category}`)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{categoryWeight} {t("dashboard.keyMetrics.totalWeight.unit")}</div>
                      <div className="text-xs text-gray-500">{t("dashboard.mainContentGrid.wasteCategories.ordersCount", { count: categoryOrders.length })}</div>
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
                {t("dashboard.routesAndDepots.activeRoutes.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.routesAndDepots.activeRoutes.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[500px] overflow-auto">
              {mockData.routes.map((route) => (
                <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Route #{route.id}</span>
                      <Badge className={getStatusColor(route.status)}>
                        {t(`dashboard.statuses.${route.status}`)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {route.orders.length} {t("dashboard.routesAndDepots.activeRoutes.stops")} • {route.distance} {t("dashboard.keyMetrics.totalWeight.unit")} • {route.vehicle.licensePlate}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{route.duration} {t("dashboard.routesAndDepots.activeRoutes.duration")}</div>
                    <div className="text-xs text-gray-500">{t("dashboard.routesAndDepots.activeRoutes.duration")}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t("dashboard.routesAndDepots.depotLocations.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.routesAndDepots.depotLocations.description")}</CardDescription>
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
                    <div className="text-xs text-gray-500">{t("dashboard.routesAndDepots.depotLocations.vehiclesCount")}</div>
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