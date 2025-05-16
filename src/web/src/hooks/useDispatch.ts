import { createDispatch, getCurrentDispatch, getDispatchById, getDispatches, markDispatchAsDone } from "@/apis/dispatch";
import { ApiResponse, DispatchResponse } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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

export const useMarkDispatchAsDone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dispatchId: string) => markDispatchAsDone(dispatchId),
    onSuccess: (_, dispatchId) => {
      queryClient.invalidateQueries({queryKey: ["dispatches", "current"]});
      queryClient.invalidateQueries({ queryKey: ["dispatches", dispatchId] });
    }
  });
}

export const useCreateDispatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDispatch,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["dispatches", "current"]});
    }
  });
}
