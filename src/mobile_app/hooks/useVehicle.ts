import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVehicles, createVehicle, updateVehicle, getVehicleById, getVehicleByDriverId, deleteVehicle } from "@/apis/vehicle";
import { ApiResponse, VehicleResponse, VehicleCreateRequest, VehicleUpdateRequest } from "@/types/types";
import { useToast } from "./useToast";

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
    enabled: !!driverId
  });
};

export const useGetVehicleById = (vehicleId: string) => {
  return useQuery<ApiResponse<VehicleResponse>>({
    queryKey: ["vehicles", vehicleId],
    queryFn: () => getVehicleById(vehicleId),
    enabled: !!vehicleId
  });
};

export const useCreateVehicle = () => {
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VehicleCreateRequest) => createVehicle(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      showToast(response.message, "success");
    },
  });
};

export const useUpdateVehicle = () => {
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, payload }: { vehicleId: string; payload: VehicleUpdateRequest }) =>
      updateVehicle(vehicleId, payload),
    onSuccess: (response, { vehicleId }) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles", vehicleId] });
      showToast(response.message, "success");
    },
  });
};

export const useDeleteVehicle = () => {
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => deleteVehicle(vehicleId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      showToast(response.message, "success");
    },
  });
};
