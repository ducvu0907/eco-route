import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteDepot, useGetDepots } from "@/hooks/useDepot";
import { DepotResponse } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin, Truck } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import DepotCreateModal from "@/components/depot/DepotCreateModal";
import { useState } from "react";

export default function DepotManagement() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetDepots();
  const { mutate: deleteDepot, isPending: isDeleting } = useDeleteDepot();
  const depots: DepotResponse[] = data?.result || [];


  const handleViewDepot = (depot: DepotResponse) => {
    navigate(`/depots/${depot.id}`);
  };

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
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load depots. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <DepotCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Depot Management</h2>
        <Button onClick={() => setIsModalOpen(true)}>Create Depot</Button>
      </div>

      {depots.length === 0 ? (
        <div className="text-muted-foreground">No depots found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {depots.map((depot: DepotResponse) => (
            <Card key={depot.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-start gap-2">
                  <MapPin className="w-5 h-5 shrink-0 mt-1" />
                  <span className="line-clamp-2 text-left">{depot.address ?? "N/A"}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>Latitude: {depot.latitude}</div>
                <div>Longitude: {depot.longitude}</div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Vehicles: {depot.vehicles.length}
                </div>
                <div>Created: {formatDate(depot.createdAt)}</div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDepot(depot)}
                  >
                    View
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the depot at <strong>{depot.address ?? "N/A"}</strong>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteDepot(depot.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
