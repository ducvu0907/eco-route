import { useNavigate, useParams } from "react-router";
import NotFound from "../NotFound";
import { useGetOrderById } from "@/hooks/useOrder";
import { useGetUserById } from "@/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import { useGetRouteById } from "@/hooks/useRoute";
import { OrderStatus, TrashCategory } from "@/types/types";
import SingleRouteDynamicMap from "@/components/map/SingleRouteDynamicMap";
import SingleRouteStaticMap from "@/components/map/SingleRouteStaticMap";
import {
  MapPin,
  Scale,
  Calendar,
  User,
  Phone,
  Package,
  Clock,
  CheckCircle,
  Loader2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Navigation,
  Truck,
  Route,
  Trash2,
  Eye
} from "lucide-react";

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

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case OrderStatus.IN_PROGRESS:
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case OrderStatus.PENDING:
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case OrderStatus.CANCELLED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
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
        return <Trash2 className="h-5 w-5 text-gray-500" />;
      case TrashCategory.ORGANIC:
        return <Package className="h-5 w-5 text-green-500" />;
      case TrashCategory.RECYCLABLE:
        return <Package className="h-5 w-5 text-blue-500" />;
      case TrashCategory.HAZARDOUS:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case TrashCategory.ELECTRONIC:
        return <Package className="h-5 w-5 text-purple-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
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
      <Badge variant="outline" className={categoryColors[category]}>
        {category.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full p-6">
        {/* Header Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return <NotFound />;
  }

  return (
    <div className="w-full h-full p-6">
      {/* Header */}
      <div className="mb-6">
        {/* <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button> */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
            <p className="text-muted-foreground">Order ID: {order.id}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(order.status)}
            {getStatusBadge(order.status)}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Order Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location Info */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {order.address || "No address provided"}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {order.latitude.toFixed(6)}, {order.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Scale className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium">Weight</p>
                      <p className="text-2xl font-bold">{order.weight} <span className="text-sm font-normal text-muted-foreground">kg</span></p>
                    </div>
                  </div>
                </div>

                {/* Category & Timestamps */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    {getCategoryIcon(order.category)}
                    <div className="space-y-2">
                      <p className="font-medium">Category</p>
                      {getCategoryBadge(order.category)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Created:</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Updated:</span>
                      <span>{formatDate(order.updatedAt)}</span>
                    </div>
                    {order.completedAt && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-muted-foreground">Completed:</span>
                        <span>{formatDate(order.completedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {order.description && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Description</p>
                  <p className="text-sm text-muted-foreground">{order.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Map Section */}
          {route && (order.status === OrderStatus.IN_PROGRESS || order.status === OrderStatus.COMPLETED) && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Route {order.status === OrderStatus.IN_PROGRESS ? "Tracking" : "Summary"}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 w-full rounded-b-lg overflow-hidden">
                  <SingleRouteDynamicMap route={route}/>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Customer Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isUserLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : isUserError || !user ? (
                <div className="text-center py-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Customer information unavailable</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{user.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/users/${user.id}`)}
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Customer Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.status === OrderStatus.PENDING && (
                <Button 
                  onClick={() => navigate("/dispatches/current")}
                  className="w-full"
                >
                  <Route className="h-4 w-4 mr-2" />
                  Go to Dispatch
                </Button>
              )}
              
              {route && (
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/routes/${route.id}`)}
                  className="w-full"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  View Route Details
                </Button>
              )}

              <Button 
                variant="outline"
                onClick={() => navigate("/orders")}
                className="w-full"
              >
                <Package className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </CardContent>
          </Card>

          {/* Order Stats */}
          {route && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Route Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{route.distance.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">km</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{route.duration.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">minutes</p>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span className="font-medium">{route.vehicle.licensePlate}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Driver:</span>
                    <span className="font-medium">{route.vehicle.driver.username}</span>
                  </div>
                  {order.index && (
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Stop #:</span>
                      <span className="font-medium">{order.index}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}