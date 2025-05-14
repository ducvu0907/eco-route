import { useGetCurrentDispatch } from "@/hooks/useDispatch";
import { useGetRoutesByDispatchId } from "@/hooks/useRoute";

export default function RoutesSidebar() {
  const { data: dispatchData, isLoading: isDispatchLoading, isError: isDispatchError } = useGetCurrentDispatch();
  const dispatch = dispatchData?.result;

  if (!dispatch) {
    return null;
  }

  const {data: routesData, isLoading: isRoutesLoading, isError: isRoutesError} = useGetRoutesByDispatchId(dispatch.id);
  const routes = routesData?.result;

  if (!routes) {
    return null;
  }


  if (isRoutesLoading || isDispatchLoading) {

  }

  if (isDispatchError || isRoutesError) {

  }

  return (
    
  );
}
