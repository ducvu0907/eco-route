import { useGetDepots } from "@/hooks/useDepot";
import { DepotResponse } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin, Truck } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button"; // Assuming the button component exists
import { useNavigate } from "react-router";

export default function DepotManagement() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetDepots();
  const depots: DepotResponse[] = data?.result || [];


  const handleCreateDepot = () => {
    navigate("/create-depot");
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Depot Management</h2>
        <Button onClick={handleCreateDepot}>Create Depot</Button>
      </div>

      {depots.length === 0 ? (
        <div className="text-muted-foreground">No depots found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {depots.map((depot: DepotResponse) => (
            <Card key={depot.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {depot.address ?? "N/A"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <div>Latitude: {depot.latitude}</div>
                <div>Longitude: {depot.longitude}</div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Vehicles: {depot.vehicles.length}
                </div>
                <div>Created: {formatDate(depot.createdAt)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
