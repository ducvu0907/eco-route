import { useParams } from "react-router";
import NotFound from "../NotFound";
import { useGetRoutesByDispatchId } from "@/hooks/useRoute";
import { useGetDispatchById } from "@/hooks/useDispatch";
import OngoingDispatchDetails from "@/components/dispatch/OngoingDispatchDetails";
import CompletedDispatchDetails from "@/components/dispatch/CompletedDispatchDetails";
import { Skeleton } from "@/components/ui/skeleton";
import CurrentDispatchDetails from "./CurrentDispatchDetails";

export default function DispatchDetails() {
  const { dispatchId } = useParams<string>();

  if (!dispatchId) {
    return <NotFound />;
  }

  const {
    data: dispatchData,
    isLoading: isDispatchLoading,
    isError: isDispatchError,
  } = useGetDispatchById(dispatchId);
  const dispatch = dispatchData?.result;

  const {
    data: routesData,
    isLoading: isRoutesLoading,
    isError: isRoutesError,
  } = useGetRoutesByDispatchId(dispatchId);
  const routes = routesData?.result ?? [];

  if (isDispatchLoading || isRoutesLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (isDispatchError || isRoutesError || !dispatch) {
    return <NotFound />;
  }

  return dispatch.status === "COMPLETED" ? (
    <CompletedDispatchDetails dispatch={dispatch} routes={routes} />
  ) : (
    <CurrentDispatchDetails />
  );
}
