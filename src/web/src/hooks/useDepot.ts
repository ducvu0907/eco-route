import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDepots, getDepotById, createDepot, deleteDepot, } from "@/apis/depot";
import { ApiResponse, DepotResponse, DepotCreateRequest, } from "@/types/types";

export const useGetDepots = () => {
  return useQuery<ApiResponse<DepotResponse[]>>({
    queryKey: ["depots"],
    queryFn: () => getDepots(),
  });
};

export const useGetDepotById = (depotId: string) => {
  return useQuery<ApiResponse<DepotResponse>>({
    queryKey: ["depot", depotId],
    queryFn: () => getDepotById(depotId),
    enabled: !!depotId,
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
