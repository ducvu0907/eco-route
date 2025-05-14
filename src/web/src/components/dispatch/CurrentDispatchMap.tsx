import { useGetCurrentDispatch } from "@/hooks/useDispatch";
import { useGetRoutesByDispatchId } from "@/hooks/useRoute";
import MultiRoutesDynamicMap from "../map/MultiRoutesDynamicMap";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function CurrentDispatchMap() {
  const {
    data: dispatchData,
    isLoading: isDispatchLoading,
    isError: isDispatchError,
  } = useGetCurrentDispatch();

  const dispatch = dispatchData?.result;

  const {
    data: routesData,
    isLoading: isRoutesLoading,
    isError: isRoutesError,
  } = useGetRoutesByDispatchId(dispatch?.id || "");

  const routes = routesData?.result;

  // Loading State
  if (isDispatchLoading || (dispatch && isRoutesLoading)) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[60vh] w-full" />
      </div>
    );
  }

  // Error State
  if (isDispatchError || isRoutesError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load dispatch or route data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // No dispatch or no routes
  if (!dispatch || !routes || routes.length === 0) {
    return (
      <Alert className="m-4">
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>
          There is no current dispatch or no routes associated with the dispatch.
        </AlertDescription>
      </Alert>
    );
  }

  // Map View
  return <MultiRoutesDynamicMap routes={routes} />;
}
