import { useParams } from "react-router";
import NotFound from "../NotFound";
import { useGetVehicleById } from "@/hooks/useVehicle";

export default function VehicleDetails() {
  const { vehicleId } = useParams<string>();
  if (!vehicleId) {
    return <NotFound />;
  }

  const { data, isLoading, isError } = useGetVehicleById(vehicleId);
  const vehicle = data?.result;

  if (isLoading) {
    return (

    );
  }

  if (isError) {
    return (

    );
  }

  return (

  );
}
