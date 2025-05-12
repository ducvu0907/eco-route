import { createDispatch, getCurrentDispatch, getDispatches } from "@/apis/dispatch";
import { ApiResponse, DispatchResponse } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDispatch,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["dispatches", "current"]});
    }
  });
}
