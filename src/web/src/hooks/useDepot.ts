import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDepots, getDepotById, createDepot, deleteDepot, updateDepot, } from "@/apis/depot";
import { ApiResponse, DepotResponse, DepotCreateRequest, DepotUpdateRequest, } from "@/types/types";

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
  });
};

export const useUpdateDepot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ depotId, payload }: {depotId: string, payload: DepotUpdateRequest}) => updateDepot(depotId, payload),
    onSuccess: (_data, { depotId }) => {
      queryClient.invalidateQueries({ queryKey: ["depots"] });
      queryClient.invalidateQueries({ queryKey: ["depots", depotId] });
    },
  });
};

export const useCreateDepot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DepotCreateRequest) => createDepot(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["depots"] });
    },
  });
};

export const useDeleteDepot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (depotId: string) => deleteDepot(depotId),
    onSuccess: (_data, depotId) => {
      queryClient.invalidateQueries({ queryKey: ["depots"] });
      queryClient.invalidateQueries({ queryKey: ["depots", depotId] });
    },
  });
};
