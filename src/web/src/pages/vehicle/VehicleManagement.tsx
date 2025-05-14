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
import { Truck, AlertTriangle } from "lucide-react";
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

  if (isLoading) {
    return (
      <div className="grid gap-4 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertTitle>
            <AlertTriangle className="inline-block w-4 h-4 mr-2" />
            Error
          </AlertTitle>
          <AlertDescription>
            Failed to load vehicles. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <VehicleCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Vehicle Management</h2>
        <Button onClick={() => setIsModalOpen(true)}>Create Vehicle</Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-muted-foreground">No vehicles found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  {vehicle.licensePlate}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <div>Status: {vehicle.status}</div>
                <div>Capacity: {vehicle.capacity} kg</div>
                <div>Created: {formatDate(vehicle.createdAt)}</div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                >
                  View
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isPending}>
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the vehicle. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteVehicle(vehicle.id)}
                        disabled={isPending}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
