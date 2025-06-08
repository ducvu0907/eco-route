import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetRouteById, useGetRoutesByVehicleId } from "@/hooks/useRoute";
import { formatDate } from '@/utils/formatDate';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  Package,
  Phone,
  Recycle,
  Route,
  Target,
  TrendingUp,
  Truck,
  User,
  Weight
} from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export default function RouteDetails() {
  const navigate = useNavigate();
  const { routeId } = useParams<string>();
  const { t } = useTranslation();
  const { data, isLoading } = useGetRouteById(routeId as string);
  const route = data?.result;
  const {data: routesData, isLoading: isRoutesLoading} = useGetRoutesByVehicleId(route?.vehicle.id || "");
  const totalRoutes = routesData?.result;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500';
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'REASSIGNED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'RECYCLABLE':
        return <Recycle className="h-4 w-4" />;
      case 'ORGANIC':
        return <Package className="h-4 w-4" />;
      case 'HAZARDOUS':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? t('routeDetails.durationFormat', { hours: hours, minutes: mins.toFixed(0) }) : t('routeDetails.durationMinutesFormat', { minutes: mins.toFixed(0) });
  };

  const formatDistance = (meters: number) => {
    return meters >= 1000 ? t('routeDetails.distanceKmFormat', { distance: (meters / 1000).toFixed(1) }) : t('routeDetails.distanceMetersFormat', { distance: meters });
  };

  // Advanced statistics calculations
  const routeStats = useMemo(() => {
    if (!route || !totalRoutes) return null;

    const completedRoutes = totalRoutes.filter(r => r.status === 'COMPLETED');
    const currentRouteData = {
      orders: route.orders.length,
      completedOrders: route.orders.filter(order => order.status === 'COMPLETED').length,
      distance: route.distance,
      duration: route.duration,
      weight: route.orders.reduce((sum, order) => sum + order.weight, 0),
      completedWeight: route.orders.filter(order => order.status === 'COMPLETED').reduce((sum, order) => sum + order.weight, 0)
    };

    // Calculate averages from completed routes
    const averages = {
      orders: completedRoutes.length > 0 ? completedRoutes.reduce((sum, r) => sum + r.orders.length, 0) / completedRoutes.length : 0,
      distance: completedRoutes.length > 0 ? completedRoutes.reduce((sum, r) => sum + r.distance, 0) / completedRoutes.length : 0,
      duration: completedRoutes.length > 0 ? completedRoutes.reduce((sum, r) => sum + r.duration, 0) / completedRoutes.length : 0,
      weight: completedRoutes.length > 0 ? completedRoutes.reduce((sum, r) => sum + r.orders.reduce((orderSum, order) => orderSum + order.weight, 0), 0) / completedRoutes.length : 0
    };

    // Calculate percentile ranking
    const getPercentile = (value: number, values: number[]) => {
      if (values.length === 0) return 50;
      const sorted = [...values].sort((a, b) => a - b);
      const index = sorted.findIndex(v => v >= value);
      return index === -1 ? 100 : (index / sorted.length) * 100;
    };

    const percentiles = {
      orders: getPercentile(currentRouteData.orders, completedRoutes.map(r => r.orders.length)),
      distance: getPercentile(currentRouteData.distance, completedRoutes.map(r => r.distance)),
      duration: getPercentile(currentRouteData.duration, completedRoutes.map(r => r.duration)),
      weight: getPercentile(currentRouteData.weight, completedRoutes.map(r => r.orders.reduce((sum, order) => sum + order.weight, 0)))
    };

    return {
      current: currentRouteData,
      averages,
      percentiles,
      totalRoutes: totalRoutes.length,
      completedRoutes: completedRoutes.length
    };
  }, [route, totalRoutes]);

  // Chart data preparation
  const chartData = useMemo(() => {
    if (!totalRoutes || !route) return null;

    // Route performance over time
    const routePerformanceData = totalRoutes
      .filter(r => r.status === 'COMPLETED')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((r, index) => ({
        routeNumber: index + 1,
        orders: r.orders.length,
        distance: r.distance / 1000, // Convert to km
        duration: r.duration / 60, // Convert to hours
        weight: r.orders.reduce((sum, order) => sum + order.weight, 0),
        isCurrentRoute: r.id === route.id
      }));

    // Category distribution
    const categoryData = route.orders.reduce((acc, order) => {
      acc[order.category] = (acc[order.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
      category: t(`routeDetails.category.${category}`),
      count,
      percentage: (count / route.orders.length) * 100
    }));

    // Status comparison
    const statusData = route.orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusChartData = Object.entries(statusData).map(([status, count]) => ({
      status: t(`routeDetails.status.${status}`),
      count,
      percentage: (count / route.orders.length) * 100
    }));

    return {
      routePerformance: routePerformanceData,
      categoryDistribution: categoryChartData,
      statusDistribution: statusChartData
    };
  }, [totalRoutes, route, t]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  if (isLoading || isRoutesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">{t('routeDetails.loading')}</span>
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('routeDetails.notFound.title')}</h2>
          <p className="text-gray-600">{t('routeDetails.notFound.message')}</p>
        </div>
      </div>
    );
  }

  const completedOrders = route.orders.filter(order => order.status === 'COMPLETED').length;
  const totalWeight = route.orders.reduce((sum, order) => sum + order.weight, 0);
  const completedWeight = route.orders
    .filter(order => order.status === 'COMPLETED')
    .reduce((sum, order) => sum + order.weight, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('routeDetails.title')}</h1>
          <p className="text-gray-600 mt-1">{t('routeDetails.id', { routeId: route.id })}</p>
        </div>
        <Badge className={`${getStatusColor(route.status)} text-white px-3 py-1`}>
          {t(`routeDetails.status.${route.status}`)}
        </Badge>
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">{t('routeDetails.stats.orders')}</p>
                <p className="text-2xl font-bold">{completedOrders}/{route.orders.length}</p>
                {routeStats && (
                  <p className="text-xs text-gray-500">
                    {t('routeDetails.stats.avg')}: {routeStats.averages.orders}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Route className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">{t('routeDetails.stats.distance')}</p>
                <p className="text-2xl font-bold">{formatDistance(route.distance)}</p>
                {routeStats && (
                  <p className="text-xs text-gray-500">
                    {t('routeDetails.stats.avg')}: {formatDistance(routeStats.averages.distance)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">{t('routeDetails.stats.duration')}</p>
                <p className="text-2xl font-bold">{formatDuration(route.duration)}</p>
                {routeStats && (
                  <p className="text-xs text-gray-500">
                    {t('routeDetails.stats.avg')}: {formatDuration(routeStats.averages.duration)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Weight className="h-5 w-5 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">{t('routeDetails.stats.weight')}</p>
                <p className="text-2xl font-bold">{completedWeight.toFixed(1)}/{totalWeight.toFixed(1)} {t('routeDetails.stats.kg')}</p>
                {routeStats && (
                  <p className="text-xs text-gray-500">
                    {t('routeDetails.stats.avg')}: {routeStats.averages.weight.toFixed(1)} {t('routeDetails.stats.kg')} | {routeStats.percentiles.weight.toFixed(0)}{t('routeDetails.stats.percentile')}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Comparison Cards */}
      {routeStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-sm text-gray-600">{t('routeDetails.performance.efficiencyScore')}</p>
                  <p className="text-2xl font-bold">
                    {(((routeStats.percentiles.orders + routeStats.percentiles.weight) / 2) - 
                      ((routeStats.percentiles.distance + routeStats.percentiles.duration) / 2)).toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500">{t('routeDetails.performance.higherBetter')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">{t('routeDetails.performance.completionRate')}</p>
                  <p className="text-2xl font-bold">{((completedOrders / route.orders.length) * 100).toFixed(0)}%</p>
                  <p className="text-xs text-gray-500">{t('routeDetails.performance.completedOrders', { completed: completedOrders, total: route.orders.length })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="text-sm text-gray-600">{t('routeDetails.performance.routeRank')}</p>
                  <p className="text-2xl font-bold">
                    #{totalRoutes?.findIndex(r => r.id === route.id) || 0 + 1}
                  </p>
                  <p className="text-xs text-gray-500">{t('routeDetails.performance.totalRoutes', { total: routeStats.totalRoutes })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-cyan-500" />
                <div>
                  <p className="text-sm text-gray-600">{t('routeDetails.performance.weightEfficiency')}</p>
                  <p className="text-2xl font-bold">
                    {(totalWeight / (route.distance / 1000)).toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">{t('routeDetails.performance.kgPerKm')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Route Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>{t('routeDetails.charts.performanceTrend.title')}</CardTitle>
              <CardDescription>{t('routeDetails.charts.performanceTrend.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.routePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="routeNumber" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'distance' ? `${value} ${t('routeDetails.stats.km')}` :
                      name === 'duration' ? `${value} ${t('routeDetails.stats.hours')}` :
                      name === 'weight' ? `${value} ${t('routeDetails.stats.kg')}` :
                      value,
                      ''
                      // t(`routeDetails.charts.performanceTrend.${name}`)
                    ]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#8884d8" 
                    name={t('routeDetails.charts.performanceTrend.orders')}
                    strokeWidth={2}
                    dot={(props) => {
                      const { payload } = props;
                      return payload?.isCurrentRoute ? 
                        <circle {...props} r={6} fill="#ff7300" stroke="#ff7300" strokeWidth={2} /> :
                        <circle {...props} r={3} />;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#82ca9d" 
                    name={t('routeDetails.charts.performanceTrend.weightKg')}
                    strokeWidth={2}
                    dot={(props) => {
                      const { payload } = props;
                      return payload?.isCurrentRoute ? 
                        <circle {...props} r={6} fill="#ff7300" stroke="#ff7300" strokeWidth={2} /> :
                        <circle {...props} r={3} />;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distance vs Duration Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>{t('routeDetails.charts.distanceDuration.title')}</CardTitle>
              <CardDescription>{t('routeDetails.charts.distanceDuration.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.routePerformance.slice(-10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="routeNumber" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'distance' ? `${value} ${t('routeDetails.stats.km')}` :
                      name === 'duration' ? `${value} ${t('routeDetails.stats.hours')}` :
                      value,
                      ''
                      // t(`routeDetails.charts.distanceDuration.${name}`)
                    ]}
                  />
                  <Legend />
                  <Bar 
                    dataKey="distance" 
                    fill="#8884d8" 
                    name={t('routeDetails.charts.distanceDuration.distanceKm')}
                  />
                  <Bar 
                    dataKey="duration" 
                    fill="#82ca9d" 
                    name={t('routeDetails.charts.distanceDuration.durationHrs')}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Order Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>{t('routeDetails.charts.categoryDistribution.title')}</CardTitle>
              <CardDescription>{t('routeDetails.charts.categoryDistribution.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                  >
                    {chartData.categoryDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Order Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>{t('routeDetails.charts.statusDistribution.title')}</CardTitle>
              <CardDescription>{t('routeDetails.charts.statusDistribution.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.statusDistribution} layout="vertical"> {/* Changed layout to vertical for conventional bar chart, or adjust axes for horizontal */}
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* Corrected X and Y Axes for horizontal bar chart */}
                  <XAxis type="number" />
                  <YAxis dataKey="status" type="category" width={100} />
                  <Tooltip formatter={(value) => [value, t('routeDetails.charts.statusDistribution.orders')]} />
                  <Bar dataKey="count" fill="#8884d8">
                    {chartData.statusDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>{t('routeDetails.vehicleInfo.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('routeDetails.vehicleInfo.licensePlate')}</span>
                <span className="font-medium">{route.vehicle.licensePlate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('routeDetails.vehicleInfo.type')}</span>
                <span className="font-medium">{route.vehicle.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('routeDetails.vehicleInfo.category')}</span>
                <div className="flex items-center space-x-1">
                  {getCategoryIcon(route.vehicle.category)}
                  <span className="font-medium">{route.vehicle.category}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('routeDetails.vehicleInfo.capacity')}</span>
                <span className="font-medium">{route.vehicle.capacity} {t('routeDetails.stats.kg')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('routeDetails.vehicleInfo.currentLoad')}</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{route.vehicle.currentLoad} {t('routeDetails.stats.kg')}</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(route.vehicle.currentLoad / route.vehicle.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('routeDetails.vehicleInfo.status')}</span>
                <Badge className={getStatusColor(route.vehicle.status)}>
                  {route.vehicle.status}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2 flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{t('routeDetails.driverInfo.title')}</span>
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('routeDetails.driverInfo.name')}</span>
                  <span className="font-medium">{route.vehicle.driver.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('routeDetails.driverInfo.phone')}</span>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span className="font-medium">{route.vehicle.driver.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Navigation className="h-5 w-5" />
              <span>{t('routeDetails.timeline.title')}</span>
            </CardTitle>
            <CardDescription>
              {t('routeDetails.timeline.createdOn')} {formatDate(route.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('routeDetails.timeline.started')}</span>
                <span>{formatDate(route.createdAt)}</span>
              </div>
              {route.completedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('routeDetails.timeline.completed')}</span>
                  <span>{formatDate(route.completedAt)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('routeDetails.timeline.lastUpdated')}</span>
                <span>{formatDate(route.updatedAt)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="font-medium mb-3">{t('routeDetails.timeline.progress')}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('routeDetails.timeline.ordersCompleted')}</span>
                  <span>{completedOrders} {t('routeDetails.timeline.of')} {route.orders.length}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${(completedOrders / route.orders.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {routeStats && (
              <>
                <Separator className="my-4" />
                <div>
                  <h4 className="font-medium mb-3">{t('routeDetails.timeline.vehiclePerformanceSummary')}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">{t('routeDetails.timeline.totalRoutes')}:</span>
                      <span className="font-medium ml-2">{routeStats.totalRoutes}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{t('routeDetails.timeline.completedRoutes')}:</span>
                      <span className="font-medium ml-2">{routeStats.completedRoutes}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card className='max-h-[800px]'>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>{t('routeDetails.ordersList.title', { count: route.orders.length })}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='overflow-auto'>
          <div className="space-y-4">
            {route.orders.map((order, index) => (
              <div key={order.id} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-end">
                <div className="flex-1 mb-4 sm:mb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {order.index || index + 1}
                        </span>
                        <Badge className={getOrderStatusColor(order.status)}>
                          {t(`routeDetails.orderStatus.${order.status}`)}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          {getCategoryIcon(order.category)}
                          <span>{t(`routeDetails.category.${order.category}`)}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                            <span className="text-sm">{order.address}</span>
                          </div>
                          {order.description && (
                            <p className="text-sm text-gray-600 ml-6">{order.description}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Weight className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{order.weight} {t('routeDetails.stats.kg')}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          {order.completedAt && (
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">
                                {t('routeDetails.orderCompleted')}: {formatDate(order.completedAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant={"outline"} onClick={() => navigate(`/orders/${order.id}`)} className="w-full sm:w-auto">
                  {t('routeDetails.viewOrderDetails')}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}