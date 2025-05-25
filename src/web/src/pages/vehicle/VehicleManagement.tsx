import { useDeleteVehicle, useGetVehicles } from "@/hooks/useVehicle";
import { VehicleResponse } from "@/types/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { 
  Truck, 
  AlertTriangle, 
  Plus, 
  Eye, 
  Trash2, 
  Activity,
  Wrench,
  Clock,
  Package,
  Gauge
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import VehicleCreateModal from "@/components/vehicle/VehicleCreateModal";

export default function VehicleManagement() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { mutate: deleteVehicle, isPending } = useDeleteVehicle();
  const { data, isLoading, isError } = useGetVehicles();
  const vehicles: VehicleResponse[] = data?.result || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Activity className="w-4 h-4 text-green-500" />;
      case 'IDLE':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'REPAIR':
        return <Wrench className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'IDLE':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'REPAIR':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'GENERAL':
        return 'text-slate-600 bg-slate-100';
      case 'ORGANIC':
        return 'text-green-600 bg-green-100';
      case 'RECYCLABLE':
        return 'text-blue-600 bg-blue-100';
      case 'HAZARDOUS':
        return 'text-red-600 bg-red-100';
      case 'ELECTRONIC':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-red-800">Error Loading Vehicles</AlertTitle>
            <AlertDescription className="text-red-700">
              Failed to load vehicles. Please check your connection and try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <VehicleCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Vehicle Management
              </h1>
              <p className="text-gray-600">
                Manage your fleet of {vehicles.length} vehicles
              </p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {vehicles.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Truck className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first vehicle to the fleet.</p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Vehicle
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Truck className="w-5 h-5 text-blue-600" />
                      </div>
                      {vehicle.licensePlate}
                    </CardTitle>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(vehicle.status)}`}>
                      {getStatusIcon(vehicle.status)}
                      {vehicle.status}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Package className="w-4 h-4" />
                        Capacity
                      </div>
                      <div className="font-semibold text-gray-900">
                        {vehicle.capacity.toLocaleString()} kg
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Gauge className="w-4 h-4" />
                        Load
                      </div>
                      <div className="font-semibold text-gray-900">
                        {vehicle.currentLoad.toLocaleString()} kg
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Category</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(vehicle.category)}`}>
                        {vehicle.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Driver</span>
                      <span className="font-medium text-gray-900">{vehicle.driver.username}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Created</span>
                      <span className="text-gray-900">{formatDate(vehicle.createdAt)}</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((vehicle.currentLoad / vehicle.capacity) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    {Math.round((vehicle.currentLoad / vehicle.capacity) * 100)}% capacity used
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                      className="flex-1 border-gray-200 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          disabled={isPending}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete vehicle {vehicle.licensePlate}? This action cannot be undone and will permanently remove all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteVehicle(vehicle.id)}
                            disabled={isPending}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isPending ? 'Deleting...' : 'Delete Vehicle'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}