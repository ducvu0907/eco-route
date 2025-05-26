import {
  useGetVehicleByDriverId,
  useGetVehicles,
} from "@/hooks/useVehicle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { VehicleStatus } from "@/types/types";
import { useNavigate } from "react-router";
import { 
  Truck, 
  MapPin, 
  Package, 
  Gauge, 
  Navigation,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

interface DriverVehicleProps {
  driverId: string;
}

export default function DriverVehicle({ driverId }: DriverVehicleProps) {
  const navigate = useNavigate();
  const {
    data: allVehiclesData,
    isLoading: isVehiclesLoading
  } = useGetVehicles();
  const {
    data: assignedVehicleData,
    isLoading,
  } = useGetVehicleByDriverId(driverId);

  const vehicle = assignedVehicleData?.result;
  const vehicles = allVehiclesData?.result || [];

  const getStatusIcon = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.ACTIVE:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case VehicleStatus.IDLE:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case VehicleStatus.REPAIR:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.ACTIVE:
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case VehicleStatus.IDLE:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Idle</Badge>;
      case VehicleStatus.REPAIR:
        return <Badge variant="destructive">Repair</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLoadPercentage = (currentLoad: number, capacity: number) => {
    return Math.min((currentLoad / capacity) * 100, 100);
  };

  if (isLoading || isVehiclesLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            <CardTitle>Assigned Vehicle</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Assigned Vehicle</CardTitle>
          </div> */}
          {vehicle && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/vehicles/${vehicle.id}`)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {vehicle ? (
          <div className="space-y-6">
            {/* Vehicle Header */}
            <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">{vehicle.licensePlate}</span>
                  {getStatusIcon(vehicle.status)}
                </div>
                <p className="text-sm text-muted-foreground">Vehicle ID: {vehicle.id}</p>
              </div>
              {getStatusBadge(vehicle.status)}
            </div>

            {/* Vehicle Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Capacity Card */}
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Package className="h-4 w-4" />
                  Load Capacity
                </div>
                <div className="space-y-2">
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold">{vehicle.currentLoad || 0}</span>
                    <span className="text-sm text-muted-foreground">/ {vehicle.capacity} kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        getLoadPercentage(vehicle.currentLoad || 0, vehicle.capacity) > 80 
                          ? 'bg-red-500' 
                          : getLoadPercentage(vehicle.currentLoad || 0, vehicle.capacity) > 60 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                      style={{ 
                        width: `${getLoadPercentage(vehicle.currentLoad || 0, vehicle.capacity)}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getLoadPercentage(vehicle.currentLoad || 0, vehicle.capacity).toFixed(1)}% full
                  </p>
                </div>
              </div>

              {/* Vehicle Type Card */}
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Gauge className="h-4 w-4" />
                  Vehicle Type
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold">
                    {vehicle.type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {vehicle.category.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Location Info */}
            {vehicle.status === VehicleStatus.ACTIVE && (
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <Navigation className="h-4 w-4" />
                  Current Location
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="font-mono text-sm">
                    {vehicle.currentLatitude.toFixed(6)}, {vehicle.currentLongitude.toFixed(6)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <Truck className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">No Vehicle Assigned</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                This driver hasn't been assigned to any vehicle yet. Contact your manager for vehicle assignment.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}