import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRouteById, getRoutesByVehicleId, getRoutesByDispatchId, getVehicleActiveRoute, markRouteAsDone, } from "@/apis/route";
import { ApiResponse, RouteResponse } from "@/types/types";

export const useGetRouteById = (routeId: string) => {
  return useQuery<ApiResponse<RouteResponse>>({
    queryKey: ["routes", routeId],
    queryFn: () => getRouteById(routeId),
    enabled: !!routeId,
  });
}

export const useGetVehicleActiveRoute = (vehicleId: string) => {
  return useQuery<ApiResponse<RouteResponse>>({
    queryKey: ["vehicles", vehicleId, "route"],
    queryFn: () => getVehicleActiveRoute(vehicleId),
    enabled: !!vehicleId,
  });
}

export const useGetRoutesByVehicleId = (vehicleId: string) => {
  return useQuery<ApiResponse<RouteResponse[]>>({
    queryKey: ["vehicles", vehicleId, "routes"],
    queryFn: () => getRoutesByVehicleId(vehicleId),
    enabled: !!vehicleId,
  });
}

export const useGetRoutesByDispatchId = (dispatchId: string) => {
  return useQuery<ApiResponse<RouteResponse[]>>({
    queryKey: ["dispatches", dispatchId, "routes"],
    queryFn: () => getRoutesByDispatchId(dispatchId),
    enabled: !!dispatchId,
  });
}

export const useMarkRouteAsDone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routeId: string) => markRouteAsDone(routeId),
    onSuccess: (_data, routeId) => {
      queryClient.invalidateQueries({queryKey: ["routes", routeId]});
    },
  });
}