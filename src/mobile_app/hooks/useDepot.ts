import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDepots, getDepotById, createDepot, deleteDepot, updateDepot, } from "@/apis/depot";
import { ApiResponse, DepotResponse, DepotCreateRequest, DepotUpdateRequest, } from "@/types/types";
import { useToast } from "./useToast";

export const useGetDepots = () => {
  return useQuery<ApiResponse<DepotResponse[]>>({
    queryKey: ["depots"],
    queryFn: () => getDepots(),
  });
};

export const useGetDepotById = (depotId: string) => {
  return useQuery<ApiResponse<DepotResponse>>({
    queryKey: ["depots", depotId],
    queryFn: () => getDepotById(depotId),
    enabled: !!depotId
  });
};

export const useUpdateDepot = () => {
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ depotId, payload }: {depotId: string, payload: DepotUpdateRequest}) => updateDepot(depotId, payload),
    onSuccess: (response, { depotId }) => {
      queryClient.invalidateQueries({ queryKey: ["depots"] });
      queryClient.invalidateQueries({ queryKey: ["depots", depotId] });
      showToast(response.message, "success");
    },
  });
};

export const useCreateDepot = () => {
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DepotCreateRequest) => createDepot(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["depots"] });
      showToast(response.message, "success");
    },
  });
};

export const useDeleteDepot = () => {
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (depotId: string) => deleteDepot(depotId),
    onSuccess: (response, depotId) => {
      queryClient.invalidateQueries({ queryKey: ["depots"] });
      queryClient.invalidateQueries({ queryKey: ["depots", depotId] });
      showToast(response.message, "success");
    },
  });
};
