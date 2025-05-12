import { useGetOrders } from "@/hooks/useOrder";
import { OrderResponse } from "@/types/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { formatDate } from "@/utils/formatDate";
import { useNavigate } from "react-router";

export default function OrderManagement() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetOrders();
  const orders: OrderResponse[] = data?.result || [];

  if (isLoading) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Loading Orders...</CardTitle>
        </CardHeader>
        <CardContent>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full mb-2" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load orders. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Est. Weight</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Completed At</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell>
                  {order.latitude}, {order.longitude}
                </TableCell>
                <TableCell>{order.address || "N/A"}</TableCell>
                <TableCell>{order.weight} kg</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{formatDate(order.completedAt)}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
