import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { OrderResponse, OrderStatus, TrashCategory } from "@/types/types";
import { formatDate } from "@/utils/formatDate";
import { AlertCircle, Calendar, CheckCircle, Clock, Eye, Loader2, MapPin, Package, Scale, Trash2, XCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next"; // Assuming you are using react-i18next

export default function PendingOrdersSidebar({ orders }: { orders: OrderResponse[] }) {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Namespace for translations

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
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">{t("pendingOrdersSidebar.status.completed")}</Badge>;
      case OrderStatus.IN_PROGRESS:
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">{t("pendingOrdersSidebar.status.inProgress")}</Badge>;
      case OrderStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">{t("pendingOrdersSidebar.status.pending")}</Badge>;
      case OrderStatus.CANCELLED:
        return <Badge variant="destructive">{t("pendingOrdersSidebar.status.cancelled")}</Badge>;
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

    // Use t() for category names
    const categoryName = t(`pendingOrdersSidebar.category.${category.toLowerCase()}`);

    return (
      <Badge variant="outline" className={`text-xs ${categoryColors[category]}`}>
        {categoryName}
      </Badge>
    );
  };

  if (!orders.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full text-center">
          <CardContent>
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">{t("noPendingOrdersTitle")}</CardTitle>
            <p className="text-muted-foreground">{t("pendingOrdersSidebar.noPendingOrdersDescription")}</p>
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
              <h3 className="font-semibold text-lg">{t("noOrdersFoundTitle")}</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {t("pendingOrdersSidebar.noOrdersFoundDescription")}
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
                        {order.address || t("pendingOrdersSidebar.addressNotProvided")}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(order.category)}
                        <span>{t(`pendingOrdersSidebar.category.${order.category.toLowerCase()}`)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Scale className="h-3 w-3" />
                        <span>{order.weight} {t("pendingOrdersSidebar.weightUnit")}</span>
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
                    <span className="text-muted-foreground">{t("pendingOrdersSidebar.descriptionLabel")} </span>
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
                    {t("pendingOrdersSidebar.viewButton")}
                  </Button>
                </div>

                {/* Completion Info */}
                {order.completedAt && (
                  <div className="mt-2 pt-2 border-t border-muted text-xs text-muted-foreground">
                    {t("pendingOrdersSidebar.completedDate", { date: formatDate(order.completedAt) })}
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