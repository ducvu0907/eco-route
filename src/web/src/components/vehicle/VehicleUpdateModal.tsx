import { useUpdateVehicle } from "@/hooks/useVehicle";

export default function VehicleUpdateModal() {
  const { mutate: updateVehicle, isPending } = useUpdateVehicle();

}
