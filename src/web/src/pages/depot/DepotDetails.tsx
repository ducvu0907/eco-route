import { useNavigate, useParams } from "react-router";
import { useGetDepotById } from "@/hooks/useDepot";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import NotFound from "../NotFound";
import { formatDate } from "@/utils/formatDate";
import VehicleCreateModal from "../../components/vehicle/VehicleCreateModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DepotUpdatemodal from "@/components/depot/DepotUpdateModal";

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
      <div className="p-6 space-y-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load depot details. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!depot) {
    return <NotFound />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Depot Info */}
      <DepotUpdatemodal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} depot={depot}/>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle className="text-xl">Depot Details</CardTitle>
          <Button onClick={() => setIsUpdateOpen(true)}>Edit</Button>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>Address:</strong> {depot.address ?? "N/A"}</div>
          <div><strong>Coordinates:</strong> {depot.latitude}, {depot.longitude}</div>
          <div><strong>Created At:</strong> {formatDate(depot.createdAt)}</div>
          <div><strong>Updated At:</strong> {formatDate(depot.updatedAt)}</div>
          <div><strong>Total Vehicles:</strong> {depot.vehicles.length}</div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <div className="flex flex-row justify-between">
            <CardTitle className="text-lg">Assigned Vehicles</CardTitle>
            <Button onClick={() => setIsModalOpen(true)}>Create vehicle</Button>
          </div>
          <VehicleCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} depot={depot} />
        </CardHeader>

        <CardContent>
          {depot.vehicles.length === 0 ? (
            <div className="text-muted-foreground">No vehicles assigned to this depot.</div>
          ) : (
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
              {depot.vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex flex-col md:flex-row md:items-center justify-between border p-4 rounded-xl shadow-sm bg-white gap-4"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm flex-1">
                    <div><strong>License Plate:</strong> {vehicle.licensePlate}</div>
                    <div><strong>Status:</strong> {vehicle.status}</div>
                    <div><strong>Capacity:</strong> {vehicle.capacity} kg</div>
                    <div><strong>Current Load:</strong> {vehicle.currentLoad ?? "N/A"} kg</div>
                    <div>
                      <strong>Location:</strong>{" "}
                      {vehicle.currentLatitude && vehicle.currentLongitude
                        ? `${vehicle.currentLatitude}, ${vehicle.currentLongitude}`
                        : "N/A"}
                    </div>
                    <div><strong>Created:</strong> {formatDate(vehicle.createdAt)}</div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

      </Card>
    </div>
  );
}
