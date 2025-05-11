import { useGetVehicles } from "@/hooks/useVehicle";
import { VehicleResponse } from "@/types/types";

export default function VehicleManagement() {
  const { data, isLoading, isError } = useGetVehicles();
  const vehicles: VehicleResponse[] = data?.result || [];

  if (isLoading) {

  }

  if (isError) {

  }
  
  return (

  );
}
