// CustomerOrders.tsx
import { useGetOrdersByUserId } from "@/hooks/useOrder";
import { OrderStatus, TrashCategory } from "@/types/types";
import { formatDate } from "@/utils/formatDate";
import {
  AlertCircle,
  Calendar,
  Eye,
  MapPin,
  Package,
  Scale,
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface CustomerOrdersProps {
  userId: string;
}

export default function CustomerOrders({ userId }: CustomerOrdersProps) {
  const { data, isLoading, isError } = useGetOrdersByUserId(userId);
  const orders = data?.result;
  const navigate = useNavigate();

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
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <CardTitle>Orders</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <CardTitle>Orders</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Unable to fetch orders. Please try again later.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <CardTitle>Orders</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">No Orders Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                This customer hasn't placed any orders yet. Orders will appear here once they start using the service.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <CardTitle>Orders ({orders.length})</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {orders.map((order) => (
            <div
              key={order.id}
              className="group p-4 border rounded-lg hover:bg-accent/50 transition-all hover:shadow-sm"
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium line-clamp-2 group-hover:text-foreground">
                      {order.address || "No address provided"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(order.category)}
                      <span>{order.category.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Scale className="h-3 w-3" />
                      <span>{order.weight} kg</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Description */}
              {order.description && (
                <div className="mb-3 p-3 bg-muted/50 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Description:</p>
                  <p className="text-sm">{order.description}</p>
                </div>
              )}

              {/* Order Footer */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {getCategoryBadge(order.category)}
                  {order.completedAt && (
                    <span className="text-xs text-muted-foreground">
                      Completed: {formatDate(order.completedAt)}
                    </span>
                  )}
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
}