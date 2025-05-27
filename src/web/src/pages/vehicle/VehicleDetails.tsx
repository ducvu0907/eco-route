import { useNavigate, useParams } from "react-router";
import NotFound from "../NotFound";
import { useGetVehicleById } from "@/hooks/useVehicle";
import { useGetRoutesByVehicleId } from "@/hooks/useRoute";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RouteResponse, VehicleResponse, OrderResponse, RouteStatus, VehicleStatus } from "@/types/types";
import { Button } from "@/components/ui/button";
import VehicleUpdateModal from "@/components/vehicle/VehicleUpdateModal";
import { LatLngExpression } from "leaflet";
import { useGetDepotById } from "@/hooks/useDepot";
import SingleRouteStaticMap from "@/components/map/SingleRouteStaticMap";
import SingleRouteDynamicMap from "@/components/map/SingleRouteDynamicMap";
import { 
  Truck, 
  User, 
  MapPin, 
  Weight, 
  Route, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Navigation,
  Edit,
  Calendar,
  Activity
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";

export default function VehicleDetails() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const [selectedRoute, setSelectedRoute] = useState<RouteResponse | null>(null);

  if (!vehicleId) return <NotFound />;

  const {
    data: vehicleData,
    isLoading: isVehicleLoading,
    isError: isVehicleError,
  } = useGetVehicleById(vehicleId);

  const {
    data: routesData,
    isLoading: isRoutesLoading,
    isError: isRoutesError,
  } = useGetRoutesByVehicleId(vehicleId);

  const vehicle: VehicleResponse | null = vehicleData?.result ?? null;
  const routes: RouteResponse[] = routesData?.result ?? [];

  const { data: depotData, isLoading: isDepotLoading } = useGetDepotById(vehicle?.depotId || "");
  const depot = depotData?.result;

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.ACTIVE:
        return "bg-green-500 hover:bg-green-600";
      case VehicleStatus.IDLE:
        return "bg-yellow-500 hover:bg-yellow-600";
      case VehicleStatus.REPAIR:
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getRouteStatusColor = (status: RouteStatus) => {
    switch (status) {
      case RouteStatus.IN_PROGRESS:
        return "bg-blue-500 hover:bg-blue-600";
      case RouteStatus.COMPLETED:
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusIcon = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.ACTIVE:
        return <CheckCircle className="h-4 w-4" />;
      case VehicleStatus.IDLE:
        return <Clock className="h-4 w-4" />;
      case VehicleStatus.REPAIR:
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (isVehicleLoading || isRoutesLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] lg:col-span-1" />
          <Skeleton className="h-[400px] lg:col-span-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  if (isVehicleError || isRoutesError || !vehicle || !depot) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <VehicleUpdateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicle={vehicle}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Details</h1>
            <p className="text-gray-600 mt-1">Manage and monitor vehicle information</p>
          </div>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center space-x-2">
          <Edit className="h-4 w-4" />
          <span>Edit Vehicle</span>
        </Button>
      </div>

      {/* Vehicle Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Vehicle Info */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span>Vehicle Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">License Plate</span>
              <Badge variant="outline" className="font-mono">
                {vehicle.licensePlate}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Status</span>
              <Badge className={`text-white ${getStatusColor(vehicle.status)}`}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(vehicle.status)}
                  <span>{vehicle.status}</span>
                </div>
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                <Weight className="h-4 w-4" />
                <span>Capacity</span>
              </span>
              <span className="font-semibold">{vehicle.capacity} kg</span>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                <Package className="h-4 w-4" />
                <span>Current Load</span>
              </span>
              <div className="text-right">
                <span className="font-semibold">{vehicle.currentLoad} kg</span>
                <div className="text-xs text-gray-500">
                  {((vehicle.currentLoad / vehicle.capacity) * 100).toFixed(1)}% full
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Driver</span>
              </span>
              <div className="pl-5">
                <p className="font-medium">{vehicle.driver.username}</p>
                <p className="text-sm text-gray-500">{vehicle.driver.phone}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Depot</span>
              </span>
              <p className="text-sm pl-5">{depot.address}</p>
            </div>
          </CardContent>
        </Card>

        {/* Routes List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Route className="h-5 w-5" />
              <span>Routes ({routes.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {routes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <Route className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">No routes available for this vehicle.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {routes.map((route) => (
                    <Card
                      key={route.id}
                      onClick={() => setSelectedRoute(route)}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedRoute?.id === route.id
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">Route #{route.id.slice(-8)}</h3>
                          <Badge className={`text-white ${getRouteStatusColor(route.status)}`}>
                            {route.status === RouteStatus.IN_PROGRESS ? (
                              <div className="flex items-center space-x-1">
                                <Activity className="h-3 w-3" />
                                <span>In Progress</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Completed</span>
                              </div>
                            )}
                          </Badge>
                          <Button
                            variant={"outline"}
                            onClick={() => navigate(`/dispatches/${route.dispatchId}`)}
                          >
                            Go to dispatch
                          </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Navigation className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-gray-600">Distance</p>
                              <p className="font-medium">{route.distance} km</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-gray-600">Orders</p>
                              <p className="font-medium">{route.orders.length}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-gray-600">Duration</p>
                              <p className="font-medium">{Math.round(route.duration / 60)} min</p>
                            </div>
                          </div>
                        </div>

                        {route.completedAt && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              <span>Completed: {formatDate(route.completedAt)}</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Route Map</span>
            {selectedRoute && (
              <Badge variant="outline" className="ml-2">
                Route #{selectedRoute.id.slice(-8)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedRoute ? (
            <div className="h-[500px] rounded-lg overflow-hidden">
              {selectedRoute.status === RouteStatus.IN_PROGRESS && (
                <SingleRouteDynamicMap route={selectedRoute} />
              )}
              {selectedRoute.status === RouteStatus.COMPLETED && (
                <SingleRouteStaticMap route={selectedRoute} />
              )}
            </div>
          ) : (
            <div className="h-[500px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Route</h3>
                <p className="text-gray-500">Choose a route from the list above to view it on the map</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}