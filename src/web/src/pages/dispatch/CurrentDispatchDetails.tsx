import { useState } from "react";
import { 
  Truck, 
  MapPin, 
  Package, 
  Clock, 
  Route, 
  AlertCircle, 
  CheckCircle2,
  RotateCcw,
  Weight,
  Navigation,
  Calendar,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useCreateDispatch, useGetCurrentDispatch, useMarkDispatchAsDone } from "@/hooks/useDispatch";
import MultiRoutesDynamicMap from "@/components/map/MultiRoutesDynamicMap";
import { useGetPendingOrders } from "@/hooks/useOrder";
import { useGetRoutesByDispatchId } from "@/hooks/useRoute";
import NoDispatch from "./NoDispatch";
import { DispatchStatus, RouteResponse, RouteStatus, TrashCategory } from "@/types/types";
import SingleRouteDynamicMap from "@/components/map/SingleRouteDynamicMap";
import { formatDate } from "@/utils/formatDate";
import { createDropdownMenuScope } from "@radix-ui/react-dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";

const getCategoryBadgeVariant = (category: TrashCategory) => {
  switch (category) {
    case "GENERAL": return "default";
    case "RECYCLABLE": return "secondary";
    case "ORGANIC": return "outline";
    case "HAZARDOUS": return "destructive";
    case "ELECTRONIC": return "secondary";
    default: return "default";
  }
};

const getStatusBadgeVariant = (status: DispatchStatus | RouteStatus) => {
  switch (status) {
    case "IN_PROGRESS": return "default";
    case "COMPLETED": return "secondary";
    default: return "default";
  }
};

export default function CurrentDispatchDetails() {
  const queryClient = useQueryClient();
  const { mutate: createDispatch, isPending } = useCreateDispatch();
  const { mutate: markAsDone, isPending: isMarking } = useMarkDispatchAsDone();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRoute, setSelectedRoute] = useState<RouteResponse | null>(null);
  console.log(selectedRoute);

  const {
    data: dispatchData,
    isLoading: isDispatchLoading,
    isError: isDispatchError,
  } = useGetCurrentDispatch();

  const dispatch = dispatchData?.result;

  const {
    data: routesData,
    isLoading: isRoutesLoading,
    isError: isRoutesError,
  } = useGetRoutesByDispatchId(dispatch?.id || "");

  const {
    data: pendingOrdersData,
    isLoading: isPendingLoading,
    isError: isPendingError,
  } = useGetPendingOrders();

  const routes = routesData?.result || [];
  const pendingOrders = pendingOrdersData?.result || [];

  const isLoading = isDispatchLoading || isRoutesLoading || isPendingLoading;
  const isError = isDispatchError || isRoutesError || isPendingError;

  // Calculate stats
  const totalOrders = selectedRoute === null ? routes.reduce((sum, route) => sum + (route.orders?.length || 0), 0) : selectedRoute.orders.length;
  const totalDistance = selectedRoute === null ? routes.reduce((sum, route) => sum + route.distance, 0) : selectedRoute.distance;
  const totalDuration = selectedRoute === null ? routes.reduce((sum, route) => sum + route.duration, 0) : selectedRoute.duration;

  const onSubmit = () => {
    createDispatch(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["orders", "pending"]});
      }
    });
  };

  if (!dispatch) {
    return <NoDispatch />;
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] gap-6 p-6">
        <Skeleton className="flex-1 h-full" />
        <Skeleton className="w-96 h-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load dispatch details. Please try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex h-full bg-slate-50">
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Route className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Active Dispatch</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={getStatusBadgeVariant(dispatch.status)}>
                {dispatch.status.replace('_', ' ')}
              </Badge>
              <div className="flex gap-2">
                <Button 
                  onClick={onSubmit} 
                  disabled={isPending}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reroute
                </Button>
                <Button 
                  onClick={() => markAsDone(dispatch.id)} 
                  disabled={isMarking}
                  size="sm"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Active Routes</p>
                    <p className="text-2xl font-bold">{routes.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Orders</p>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Navigation className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Distance</p>
                    <p className="text-2xl font-bold">{totalDistance.toFixed(1)} km</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Est. Duration</p>
                    <p className="text-2xl font-bold">{totalDuration.toFixed(2)} min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map */}
        <div className="h-[calc(100%-280px)]">
          {selectedRoute == null ? <MultiRoutesDynamicMap routes={routes} /> : <SingleRouteDynamicMap route={selectedRoute}/>}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-96 border-l bg-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b px-6 py-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="routes" className="text-xs">Routes</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-6 m-0">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Dispatch Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <Badge variant={getStatusBadgeVariant(dispatch.status)} className="text-xs">
                      {dispatch.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Created:</span>
                    <span>{formatDate(dispatch.createdAt)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <p className="text-xl font-bold text-slate-900">{routes.length}</p>
                    <p className="text-xs text-slate-500">Active Routes</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <p className="text-xl font-bold text-slate-900">{pendingOrders.length}</p>
                    <p className="text-xs text-slate-500">Pending Orders</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Routes Tab */}
            <TabsContent value="routes" className="p-6 space-y-4 m-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  Active Routes ({routes.length})
                </h3>
              </div>
              
              <div className="space-y-3">
                {routes.map((route) => (
                  <Card key={route.id}
                  className={`cursor-pointer border-l-4 ${selectedRoute && selectedRoute.id === route.id ? 'border-l-blue-600 bg-blue-50' : 'border-l-blue-300 hover:bg-blue-50'}`}
                    onClick={() => {
                      if (selectedRoute && selectedRoute.id === route.id) {
                        setSelectedRoute(null);
                      } else {
                        setSelectedRoute(route);
                      }
                    }}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-slate-500" />
                            <span className="font-medium">{route.vehicle?.licensePlate}</span>
                          </div>
                          {selectedRoute && selectedRoute.id === route.id && (
                            <CheckCircle2 className="h-4 w-4 text-blue-600 ml-1" />
                          )}
                          <Badge variant={getStatusBadgeVariant(route.status)} className="text-xs">
                            {route.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        <div className="text-sm text-slate-600">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-3 w-3" />
                            Driver: {route.vehicle?.driver?.username}
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Package className="h-3 w-3" />
                            Orders: {route.orders?.length ?? 0}
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Navigation className="h-3 w-3" />
                            Distance: {route.distance.toFixed(1)} km
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            Duration: {route.duration} min
                          </div>
                        </div>

                        {/* Load Progress */}
                        {/* <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Load Progress</span>
                            <span>{route.vehicle?.currentLoad || 0}/{route.vehicle?.capacity || 100} kg</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${((route.vehicle?.currentLoad || 0) / (route.vehicle?.capacity || 100)) * 100}%` 
                              }}
                            />
                          </div>
                        </div> */}

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Pending Orders Tab */}
            <TabsContent value="pending" className="p-6 space-y-4 m-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Pending Orders ({pendingOrders.length})
                </h3>
              </div>
              
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-slate-500" />
                              <span className="text-sm font-medium">Order #{order.id.slice(-6)}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{order.address}</p>
                          </div>
                          <Badge variant={getCategoryBadgeVariant(order.category)} className="text-xs">
                            {order.category}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Weight className="h-3 w-3 text-slate-500" />
                            <span>{order.weight} kg</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}