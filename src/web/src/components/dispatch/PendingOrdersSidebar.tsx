import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useGetPendingOrders } from "@/hooks/useOrder";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Weight, Calendar, AlertCircle, CheckCircle, Clock, Eye, Loader2, Scale, Trash2, XCircle } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { useNavigate } from "react-router";
import { OrderStatus, TrashCategory } from "@/types/types";
import { Button } from "../ui/button";

export default function PendingOrdersSidebar() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetPendingOrders();
  const orders = data?.result || [];

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case OrderStatus.IN_PROGRESS:
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case OrderStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case OrderStatus.CANCELLED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case OrderStatus.IN_PROGRESS:
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case OrderStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Pending</Badge>;
      case OrderStatus.CANCELLED:
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: TrashCategory) => {
    switch (category) {
      case TrashCategory.GENERAL:
        return <Trash2 className="h-4 w-4 text-gray-500" />;
      case TrashCategory.ORGANIC:
        return <Package className="h-4 w-4 text-green-500" />;
      case TrashCategory.RECYCLABLE:
        return <Package className="h-4 w-4 text-blue-500" />;
      case TrashCategory.HAZARDOUS:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case TrashCategory.ELECTRONIC:
        return <Package className="h-4 w-4 text-purple-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryBadge = (category: TrashCategory) => {
    const categoryColors = {
      [TrashCategory.GENERAL]: "bg-gray-100 text-gray-800 border-gray-200",
      [TrashCategory.ORGANIC]: "bg-green-100 text-green-800 border-green-200",
      [TrashCategory.RECYCLABLE]: "bg-blue-100 text-blue-800 border-blue-200",
      [TrashCategory.HAZARDOUS]: "bg-red-100 text-red-800 border-red-200",
      [TrashCategory.ELECTRONIC]: "bg-purple-100 text-purple-800 border-purple-200"
    };

    return (
      <Badge variant="outline" className={`text-xs ${categoryColors[category]}`}>
        {category.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Loading Orders...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load pending orders.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full text-center">
          <CardContent>
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No Pending Orders</CardTitle>
            <p className="text-muted-foreground">All orders have been processed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100%-80px)] p-2">
      <div className="h-full px-6 pb-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">No Orders Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                No waste collection orders have been placed yet. Orders will appear here once customers start using the service.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="group p-4 border rounded-lg hover:bg-accent/50 transition-all hover:shadow-sm cursor-pointer"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm font-medium line-clamp-1 group-hover:text-foreground">
                        {order.address || "No address provided"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(order.category)}
                        <span>{order.category.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Scale className="h-3 w-3" />
                        <span>{order.weight} kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getStatusIcon(order.status)}
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Description */}
                {order.description && (
                  <div className="mb-3 p-2 bg-muted/30 rounded text-xs">
                    <span className="text-muted-foreground">Description: </span>
                    <span className="text-foreground">{order.description}</span>
                  </div>
                )}

                {/* Order Footer */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {getCategoryBadge(order.category)}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>

                {/* Completion Info */}
                {order.completedAt && (
                  <div className="mt-2 pt-2 border-t border-muted text-xs text-muted-foreground">
                    Completed: {formatDate(order.completedAt)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
