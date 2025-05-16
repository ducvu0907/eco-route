import { useNavigate, useParams } from "react-router";
import NotFound from "../NotFound";
import { useGetOrderById } from "@/hooks/useOrder";
import { useGetUserById } from "@/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { useGetRouteById } from "@/hooks/useRoute";
import { OrderStatus } from "@/types/types";
import SingleRouteDynamicMap from "@/components/map/SingleRouteDynamicMap";
import SingleRouteStaticMap from "@/components/map/SingleRouteStaticMap";

export default function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams<string>();

  if (!orderId) {
    return <NotFound />;
  }

  const { data, isLoading, isError } = useGetOrderById(orderId);
  const order = data?.result;

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetUserById(order?.userId || "");

  const {
    data: routeData,
    isLoading: isRouteLoading,
    isError: isRouteError
  } = useGetRouteById(order?.routeId || "");

  const user = userData?.result;
  const route = routeData?.result;

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    );
  }

  if (isError || !order) {
    return <NotFound />;
  }

  return (
    <div className="h-full p-6 w-full mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Order #{order.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div>
            <strong>Status:</strong>{" "}
            <Badge>{order.status}</Badge>
          </div>
          <div><strong>Address:</strong> {order.address}</div>
          <div><strong>Coordinates:</strong> {order.latitude}, {order.longitude}</div>
          <div><strong>Weight:</strong> {order.weight} kg</div>
          <div><strong>Created At:</strong> {formatDate(order.createdAt)}</div>
          <div><strong>Updated At:</strong> {formatDate(order.updatedAt)}</div>
          <div><strong>Completed At:</strong> {formatDate(order.completedAt)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {isUserLoading ? (
            <>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </>
          ) : isUserError || !user ? (
            <div>User information could not be loaded.</div>
          ) : (
            <>
              <div><strong>Username:</strong> {user.username}</div>
              <div><strong>Phone:</strong> {user.phone}</div>
              <Button onClick={() => navigate(`/users/${user.id}`)}>View User</Button>
            </>
          )}
        </CardContent>
      </Card>

      {order.status === OrderStatus.PENDING && <Button onClick={() => navigate("/dispatches/current")}>Go to dispatch</Button>}

      {route && order.status === OrderStatus.IN_PROGRESS && <SingleRouteDynamicMap route={route}/>}

      {route && order.status === OrderStatus.COMPLETED && <SingleRouteStaticMap route={route}/>}

    </div>
  );
}
