import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVehicles, createVehicle, updateVehicle, getVehicleById, getVehicleByDriverId, deleteVehicle } from "@/apis/vehicle";
import { ApiResponse, VehicleResponse, VehicleCreateRequest, VehicleUpdateRequest } from "@/types/types";

export const useGetVehicles = () => {
  return useQuery<ApiResponse<VehicleResponse[]>>({
    queryKey: ["vehicles"],
    queryFn: () => getVehicles(),
  });
};

export const useGetVehicleByDriverId = (driverId: string) => {
  return useQuery<ApiResponse<VehicleResponse>>({
    queryKey: ["users", driverId, "vehicle"],
    queryFn: () => getVehicleByDriverId(driverId),
  });
};

export const useGetVehicleById = (vehicleId: string) => {
  return useQuery<ApiResponse<VehicleResponse>>({
    queryKey: ["vehicles", vehicleId],
    queryFn: () => getVehicleById(vehicleId),
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VehicleCreateRequest) => createVehicle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, payload }: { vehicleId: string; payload: VehicleUpdateRequest }) =>
      updateVehicle(vehicleId, payload),
    onSuccess: (_data, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles", vehicleId] });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => deleteVehicle(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });
};
