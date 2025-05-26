import { useNavigate, useParams } from "react-router";
import { useGetDepotById } from "@/hooks/useDepot";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NotFound from "../NotFound";
import { formatDate } from "@/utils/formatDate";
import VehicleCreateModal from "../../components/vehicle/VehicleCreateModal";
import { useState } from "react";
import DepotUpdatemodal from "@/components/depot/DepotUpdateModal";
import { 
  MapPin, 
  Calendar, 
  Truck, 
  Plus, 
  Edit, 
  Eye, 
  Package, 
  Gauge,
  Navigation,
  Clock,
  AlertCircle
} from "lucide-react";

export default function DepotDetails() {
  const navigate = useNavigate();
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { depotId } = useParams<string>();

  if (!depotId) {
    return <NotFound />;
  }

  const { data, isLoading, isError } = useGetDepotById(depotId);
  const depot = data?.result;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load depot details. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!depot) {
    return <NotFound />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-800 border-green-200";
      case "IDLE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REPAIR": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <DepotUpdatemodal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} depot={depot}/>
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Depot Details</h1>
          <p className="text-muted-foreground mt-1">Manage depot information and assigned vehicles</p>
        </div>
        <Button onClick={() => setIsUpdateOpen(true)} className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Depot
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{depot.vehicles.length}</p>
                <p className="text-sm text-muted-foreground">Total Vehicles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Gauge className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {depot.vehicles.filter(v => v.status === "ACTIVE").length}
                </p>
                <p className="text-sm text-muted-foreground">Active Vehicles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {depot.vehicles.reduce((sum, v) => sum + (v.currentLoad || 0), 0)} kg
                </p>
                <p className="text-sm text-muted-foreground">Total Load</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Depot Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Depot Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{depot.address || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Navigation className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">Coordinates</p>
                  <p className="text-sm text-muted-foreground">
                    {depot.latitude}, {depot.longitude}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{formatDate(depot.createdAt)}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">{formatDate(depot.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Assigned Vehicles
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage vehicles assigned to this depot
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Vehicle
            </Button>
          </div>
          <VehicleCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} depot={depot} />
        </CardHeader>

        <CardContent>
          {depot.vehicles.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No vehicles assigned</p>
              <p className="text-muted-foreground mb-4">Get started by adding your first vehicle to this depot.</p>
              {/* <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Vehicle
              </Button> */}
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {depot.vehicles.map((vehicle, index) => (
                <Card key={vehicle.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">License Plate</p>
                          <p className="font-semibold">{vehicle.licensePlate}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Status</p>
                          <Badge className={getStatusColor(vehicle.status)}>
                            {vehicle.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                          <p className="font-medium">{vehicle.capacity} kg</p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Current Load</p>
                          <p className="font-medium">
                            {vehicle.currentLoad ?? "N/A"} kg
                            {vehicle.currentLoad && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({Math.round((vehicle.currentLoad / vehicle.capacity) * 100)}%)
                              </span>
                            )}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Location</p>
                          <p className="text-sm">
                            {vehicle.currentLatitude && vehicle.currentLongitude
                              ? `${vehicle.currentLatitude.toFixed(4)}, ${vehicle.currentLongitude.toFixed(4)}`
                              : "N/A"}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Created</p>
                          <p className="text-sm">{formatDate(vehicle.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}