import { useState } from "react";
import {
  useGetVehicleByDriverId,
  useGetVehicles,
  useUpdateVehicle
} from "@/hooks/useVehicle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { VehicleStatus } from "@/types/types";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { useNavigate } from "react-router";

interface DriverVehicleProps {
  driverId: string;
}

export default function DriverVehicle({ driverId }: DriverVehicleProps) {
  const navigate = useNavigate();
  const { mutate: updateVehicle, isPending } = useUpdateVehicle();
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

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const handleAssign = () => {
    if (!selectedVehicleId) return;
    updateVehicle({
      vehicleId: selectedVehicleId,
      payload: { driverId, depotId: null }
    });
  };

  if (isLoading || isVehiclesLoading) {
    return <Skeleton className="w-full h-24" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Vehicle</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {vehicle ? (
          <>
            <div><strong>ID:</strong> {vehicle.id}</div>
            <div><strong>License Plate:</strong> {vehicle.licensePlate}</div>
            <div><strong>Status:</strong> {vehicle.status}</div>
            <div><strong>Capacity:</strong> {vehicle.capacity} kg</div>
            <div><strong>Current Load:</strong> {vehicle.currentLoad ?? "0.0"} kg</div>
            <div><strong>Location:</strong> {vehicle.status === VehicleStatus.ACTIVE ? `${vehicle.currentLatitude},${vehicle.currentLongitude}` : "N/A"}</div>
          </>
        ) : (
          <div><strong>No vehicle assigned.</strong></div>
        )}
        <div className="space-y-4">
          <div className="w-full">
            <Select onValueChange={setSelectedVehicleId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent className="w-full max-h-60 overflow-auto">
                {vehicles.map((v: any) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.licensePlate} ({v.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAssign} disabled={!selectedVehicleId || isPending}>
            {isPending ? "Assigning..." : "Assign Vehicle"}
          </Button>
          <Button variant={"secondary"} onClick={() => navigate(`/vehicles/${vehicle?.id}`)} >
            View vehicle details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
