import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGetDepots } from "@/hooks/useDepot";
import { useGetDriversNotAssigned, useGetUsers } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { DepotResponse, Role, UserResponse, VehicleResponse, VehicleStatus } from "@/types/types";
import { useUpdateVehicle } from "@/hooks/useVehicle";
import { useQueryClient } from "@tanstack/react-query";
import { 
  Truck, 
  User, 
  MapPin, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Loader2,
  Save,
  X,
  Info
} from "lucide-react";

interface VehicleUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleResponse;
}

const vehicleSchema = z.object({
  depotId: z.string().nullable(),
  driverId: z.string().nullable(),
  status: z.nativeEnum(VehicleStatus),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export default function VehicleUpdateModal({ isOpen, onClose, vehicle }: VehicleUpdateModalProps) {
  const queryClient = useQueryClient();
  const { mutate: updateVehicle, isPending } = useUpdateVehicle();

  const { data: depotsData, isLoading: isDepotsLoading, isError: isDepotsError } = useGetDepots();
  const depots = depotsData?.result;

  const { data: driversData, isLoading: isDriversLoading, isError: isDriversError } = useGetDriversNotAssigned();
  const drivers = driversData?.result;

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      depotId: vehicle.depotId || null,
      driverId: vehicle.driver.id || null, 
      status: vehicle.status,
    },
  });

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.ACTIVE:
        return "bg-green-100 text-green-800 border-green-200";
      case VehicleStatus.IDLE:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case VehicleStatus.REPAIR:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
        return <Info className="h-4 w-4" />;
    }
  };

  const onSubmit = (data: VehicleFormValues) => {
    updateVehicle(
      { vehicleId: vehicle.id, payload: data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["drivers", "not-assigned"] });
          onClose();
        },
      }
    );
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      form.reset();
    }
  };

  if (isDepotsLoading || isDriversLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span>Loading Vehicle Data</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-gray-600">Fetching depots and drivers...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isDepotsError || isDriversError) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>Error Loading Data</span>
            </DialogTitle>
          </DialogHeader>
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Failed to load depot and driver information. Please check your connection and try again.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button onClick={() => onClose()} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <span>Update Vehicle</span>
              <div className="text-sm font-normal text-gray-600 mt-1">
                {vehicle.licensePlate} • {vehicle.type}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Current Vehicle Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Info className="h-4 w-4" />
            <span>Current Vehicle Information</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">License Plate:</span>
              <p className="font-medium">{vehicle.licensePlate}</p>
            </div>
            <div>
              <span className="text-gray-600">Current Status:</span>
              <Badge className={`ml-2 mt-1 ${getStatusColor(vehicle.status)}`}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(vehicle.status)}
                  <span>{vehicle.status}</span>
                </div>
              </Badge>
            </div>
            <div>
              <span className="text-gray-600">Current Driver:</span>
              <p className="font-medium">{vehicle.driver.username}</p>
            </div>
            <div>
              <span className="text-gray-600">Capacity:</span>
              <p className="font-medium">{vehicle.capacity} kg</p>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Depot Field */}
            <FormField
              control={form.control}
              name="depotId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Depot Assignment</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a depot location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {depots?.map((depot) => (
                        <SelectItem key={depot.id} value={depot.id}>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{depot.address}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the depot where this vehicle will be stationed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Driver Field */}
            <FormField
              control={form.control}
              name="driverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Driver Assignment</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Current driver option */}
                      <SelectItem value={vehicle.driver.id}>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-blue-500" />
                          <span>{vehicle.driver.username}</span>
                          <Badge variant="outline" className="ml-2 text-xs">Current</Badge>
                        </div>
                      </SelectItem>
                      {/* Available drivers */}
                      {drivers?.filter(driver => driver.id !== vehicle.driver.id).map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{driver.username}</span>
                            <span className="text-xs text-gray-500 ml-2">({driver.phone})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Assign a driver to operate this vehicle. Only unassigned drivers are shown.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Vehicle Status</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select vehicle status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(VehicleStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(status)}
                            <span>{status}</span>
                            {status === VehicleStatus.ACTIVE && (
                              <span className="text-xs text-gray-500 ml-2">(Ready for routes)</span>
                            )}
                            {status === VehicleStatus.IDLE && (
                              <span className="text-xs text-gray-500 ml-2">(Waiting for assignment)</span>
                            )}
                            {status === VehicleStatus.REPAIR && (
                              <span className="text-xs text-gray-500 ml-2">(Under maintenance)</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set the operational status of the vehicle
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-6 gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onClose()}
                disabled={isPending}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="flex items-center space-x-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Update Vehicle</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}