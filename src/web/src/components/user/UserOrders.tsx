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
        <ul className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
          {orders?.map((order) => (
            <li
              key={order.id}
              className="border border-muted rounded-xl p-4 bg-white shadow-sm flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div><strong className="text-primary">Address:</strong> {order.address ?? "N/A"}</div>
                <div><strong className="text-primary">Status:</strong> {order.status}</div>
                <div><strong className="text-primary">Estimated Weight:</strong> {order.weight} kg</div>
                <div><strong className="text-primary">Completed At:</strong> {formatDate(order.completedAt)}</div>
                <div><strong className="text-primary">Created At:</strong> {formatDate(order.createdAt)}</div>
                <div><strong className="text-primary">Updated At:</strong> {formatDate(order.updatedAt)}</div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => navigate(`/orders/${order.id}`)}>View Details</Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
