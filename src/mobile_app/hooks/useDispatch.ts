import { createDispatch, getCurrentDispatch, getDispatchById, getDispatches } from "@/apis/dispatch";
import { ApiResponse, DispatchResponse } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./useToast";

export const useGetDispatchById = (dispatchId: string) => {
  return useQuery<ApiResponse<DispatchResponse>>({
    queryKey: ["dispatches", dispatchId],
    queryFn: () => getDispatchById(dispatchId),
    enabled: !!dispatchId
  });
}

export const useGetCurrentDispatch = () => {
  return useQuery<ApiResponse<DispatchResponse>>({
    queryKey: ["dispatches", "current"],
    queryFn: () => getCurrentDispatch()
  });
}

export const useGetDispatches = () => {
  return useQuery<ApiResponse<DispatchResponse[]>>({
    queryKey: ["dispatches"],
    queryFn: () => getDispatches()
  });
}

export const useCreateDispatch = () => {
  const {showToast} = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDispatch,
    onSuccess: (response) => {
      queryClient.invalidateQueries({queryKey: ["dispatches", "current"]});
      showToast(response.message, "success");
    }
  });
}
