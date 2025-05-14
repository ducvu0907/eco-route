import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useGetPendingOrders } from "@/hooks/useOrder";
import { Button } from "@/components/ui/button";
import { useCreateDispatch } from "@/hooks/useDispatch";

export default function PendingOrdersSidebar() {
  const { data, isLoading, isError } = useGetPendingOrders();

  const orders = data?.result || [];

  if (isLoading) {
    return (
      <Card className="w-full h-[600px] p-6">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[500px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load pending orders.</AlertDescription>
      </Alert>
    );
  }

  if (!orders.length) {
    return (
      <Card className="w-full h-[600px] p-6">
        <CardHeader>
          <CardTitle>No Pending Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No orders available for dispatch.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] overflow-y-auto">
      <CardHeader>
        <CardTitle>Pending Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-md p-4 shadow-sm">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Address:</strong> {order.address || "N/A"}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
