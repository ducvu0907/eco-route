import OrdersMap from "@/components/order/OrdersMap";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrders } from "@/hooks/useOrder";
import { OrderResponse, OrderStatus, TrashCategory } from "@/types/types";
import { formatDate } from "@/utils/formatDate";
import {
  AlertCircle,
  Calendar,
  Eye,
  List,
  ListOrderedIcon,
  Map,
  MapPin,
  Package,
  Scale,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export default function OrderManagement() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetOrders();
  const orders: OrderResponse[] = data?.result || [];
  const [filterCategory, setFilterCategory] = useState<TrashCategory | "ALL">("ALL");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "ALL">("ALL");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const { t } = useTranslation();

  const filteredOrders = orders.filter(order => {
    const categoryMatch = filterCategory === "ALL" || order.category === filterCategory;
    const statusMatch = filterStatus === "ALL" || order.status === filterStatus;
    const orderDate = order.createdAt.split("T")[0];
    const fromMatch = !startDate || orderDate >= startDate;
    const toMatch = !endDate || orderDate <= endDate;

    return categoryMatch && statusMatch && fromMatch && toMatch;
  });

  // const getStatusIcon = (status: OrderStatus) => {
  //   switch (status) {
  //     case OrderStatus.COMPLETED:
  //       return <CheckCircle className="h-4 w-4 text-green-500" />;
  //     case OrderStatus.IN_PROGRESS:
  //       return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
  //     case OrderStatus.PENDING:
  //       return <Clock className="h-4 w-4 text-yellow-500" />;
  //     case OrderStatus.CANCELLED:
  //       return <XCircle className="h-4 w-4 text-red-500" />;
  //     default:
  //       return <Clock className="h-4 w-4 text-gray-400" />;
  //   }
  // };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">{t("orderManagement.filters.status.completed")}</Badge>;
      case OrderStatus.IN_PROGRESS:
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">{t("orderManagement.filters.status.inProgress")}</Badge>;
      case OrderStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">{t("orderManagement.filters.status.pending")}</Badge>;
      case OrderStatus.CANCELLED:
        return <Badge variant="destructive">{t("orderManagement.filters.status.cancelled")}</Badge>;
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
        {t(`orderManagement.filters.category.${category.toLowerCase()}`)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{t("orderManagement.loadingState.title")}</h1>
          <p className="text-muted-foreground">{t("orderManagement.loadingState.description")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Map Skeleton */}
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                <CardTitle>{t("orderManagement.mapCard.title")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-full">
              <Skeleton className="w-full h-full rounded-lg" />
            </CardContent>
          </Card>

          {/* List Skeleton */}
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <List className="h-5 w-5" />
                <CardTitle>{t("orderManagement.listCard.title")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
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
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{t("orderManagement.pageTitle")}</h1>
          <p className="text-muted-foreground">{t("orderManagement.pageDescription", { count: orders.length })}</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("orderManagement.errorState.title")}</AlertTitle>
          <AlertDescription>
            {t("orderManagement.errorState.description")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-row items-center">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <ListOrderedIcon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="ml-2">
          <h1 className="text-2xl font-bold tracking-tight">{t("orderManagement.pageTitle")}</h1>
          <p className="text-muted-foreground">
            {t("orderManagement.pageDescription", { count: filteredOrders.length })}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col flex-wrap gap-4">
        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold">{t("orderManagement.filters.category.label")}</span>
          {["ALL", ...Object.values(TrashCategory)].map((category) => (
            <Badge
              key={category}
              variant={filterCategory === category ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterCategory(category as TrashCategory | "ALL")}
            >
              {category === "ALL"
                ? t("orderManagement.filters.category.all")
                : t(`orderManagement.filters.category.${category.toLowerCase()}`)}
            </Badge>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold">{t("orderManagement.filters.status.label")}</span>
          {["ALL", ...Object.values(OrderStatus)].map((status) => (
            <Badge
              key={status}
              variant={filterStatus === status ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterStatus(status as OrderStatus | "ALL")}
            >
              {status === "ALL"
                ? t("orderManagement.filters.status.all")
                : t(`orderManagement.filters.status.${status.toLowerCase()}`)}
            </Badge>
          ))}
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold">{t("orderManagement.filters.date.from")}</span>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value || null)}
          />
          <span className="font-semibold">{t("orderManagement.filters.date.end")}</span>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value || null)}
          />
          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setStartDate(null); setEndDate(null); }}
              className="text-xs px-2"
            >
              {t("orderManagement.filters.date.clear")}
            </Button>
          )}
        </div>

      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)] min-h-0">
        {/* Left Side - Map */}
        <Card className="h-full col-span-2 p-0">
          <CardContent className="p-0 h-full">
            <div className="h-full w-full rounded-b-lg overflow-hidden">
              <OrdersMap orders={filteredOrders} />
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Orders List */}
        <Card className="h-full min-h-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List className="h-5 w-5 text-muted-foreground" />
                <CardTitle>{t("orderManagement.listCard.title")}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {/* Status Summary */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{orders.filter(o => o.status === OrderStatus.COMPLETED).length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>{orders.filter(o => o.status === OrderStatus.PENDING).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)] p-0">
            <div className="h-full overflow-y-auto px-6 pb-6">
              {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="p-4 bg-muted rounded-full">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{t("orderManagement.listCard.noOrdersFound.title")}</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      {t("orderManagement.listCard.noOrdersFound.description")}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
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
                              {order.address || t("orderManagement.listCard.orderCard.noAddressProvided")}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              {getCategoryIcon(order.category)}
                              <span>{t(`orderManagement.filters.category.${order.category.toLowerCase()}`)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Scale className="h-3 w-3" />
                              <span>{order.weight} {t("orderManagement.listCard.orderCard.weightUnit")}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      {/* Order Description */}
                      {order.description && (
                        <div className="mb-3 p-2 bg-muted/30 rounded text-xs">
                          <span className="text-muted-foreground">{t("orderManagement.listCard.orderCard.descriptionLabel")} </span>
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
                          {t("orderManagement.listCard.orderCard.viewButton")}
                        </Button>
                      </div>

                      {/* Completion Info */}
                      {order.completedAt && (
                        <div className="mt-2 pt-2 border-t border-muted text-xs text-muted-foreground">
                          {t("orderManagement.listCard.orderCard.completedAt", { date: formatDate(order.completedAt) })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}