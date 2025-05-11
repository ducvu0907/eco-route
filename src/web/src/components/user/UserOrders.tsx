import { useGetOrdersByUserId } from "@/hooks/useOrder";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { formatDate } from "@/utils/formatDate";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

interface UserOrdersProps {
  userId: string;
};

export default function UserOrders({ userId }: UserOrdersProps) {
  const { data, isLoading, isError } = useGetOrdersByUserId(userId);
  const orders = data?.result;
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Skeleton className="w-full h-24" />
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Unable to fetch orders.</AlertDescription>
      </Alert>
    );
  }

  if (orders?.length === 0) {
    return (
      <div>User has no orders.</div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <ul className="space-y-3">
          {orders?.map((order) => (
            <li key={order.id} className="border p-3 rounded-md">
              <div className="flex flex-wrap justify-between items-start gap-y-2 text-sm">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div><strong>Address:</strong> {order.address ?? "N/A"}</div>
                  <div><strong>Status:</strong> {order.status}</div>
                  <div><strong>Estimated Weight:</strong> {order.estimatedWeight} kg</div>
                  <div><strong>Completed At:</strong> {formatDate(order.completedAt)}</div>
                  <div><strong>Created At:</strong> {formatDate(order.createdAt)}</div>
                  <div><strong>Updated At:</strong> {formatDate(order.updatedAt)}</div>
                </div>
                <Button onClick={() => navigate(`/orders/${order.id}`)}>View Details</Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
