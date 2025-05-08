import { getDispatches } from "@/apis/dispatch";
import { ApiResponse, DispatchResponse } from "@/types/types"
import { useQuery } from "@tanstack/react-query"

export const useGetDispatches = () => {
  return useQuery<ApiResponse<DispatchResponse[]>>({
    queryKey: ["dispatches"],
    queryFn: () => getDispatches()
  });
}