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
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import { useNavigate } from "react-router";
import OrdersMap from "@/components/order/OrdersMap";
import { useState } from "react";

export default function OrderManagement() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
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
      <Alert variant="destructive" className="m-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load orders. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full h-full space-y-4 pt-2">
      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between px-6">
        <h1 className="text-2xl font-semibold">Order Management</h1>
        <Button onClick={() => setViewMode(prev => prev === "list" ? "map" : "list")}>
          {viewMode === "list" ? "Switch to Map View" : "Switch to List View"}
        </Button>
      </div>

      {/* View Modes */}
      {viewMode === "list" ? (
        <Card className="mx-6">
          <CardContent className="overflow-x-auto pt-6">
            <Table>
              <TableHeader>
                <TableRow>
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
                  <TableRow
                    key={order.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
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
      ) : (
        <div className="h-[85vh] w-full px-6">
          <OrdersMap orders={orders} />
        </div>
      )}
    </div>
  );
}
