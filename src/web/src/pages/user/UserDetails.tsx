import { useParams } from "react-router";
import { useGetUserById } from "@/hooks/useUser";
import { Role } from "@/types/types";
import NotFound from "../NotFound";
import DriverVehicle from "@/components/user/DriverVehicle";
import { formatDate } from "@/utils/formatDate";
import { useTranslation } from "react-i18next";
import {
  User,
  Phone,
  Calendar,
  Clock,
  Shield,
  AlertCircle,
  Truck,
  ShoppingCart,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import CustomerOrders from "@/components/user/CustomerOrders";

export default function UserDetails() {
  const { userId } = useParams<string>();
  const { t } = useTranslation();

  if (!userId) return <NotFound />;

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetUserById(userId);

  const user = userData?.result;
  const role = user?.role;

  if (isUserLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Card className="glass shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isUserError) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-semibold">{t("userDetails.error.title")}</AlertTitle>
          <AlertDescription>
            {t("userDetails.error.description")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user) return <NotFound />;

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.MANAGER:
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            {t("userDetails.roles.manager")}
          </Badge>
        );
      case Role.DRIVER:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Truck className="w-4 h-4" />
            {t("userDetails.roles.driver")}
          </Badge>
        );
      case Role.CUSTOMER:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            {t("userDetails.roles.customer")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {t("userDetails.roles.unknown")}
          </Badge>
        );
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-muted/50 backdrop-blur-sm border shadow-md">
          <User className="h-7 w-7 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("userDetails.header.title")}</h1>
          <p className="text-muted-foreground text-sm">
            {t("userDetails.header.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card className="rounded-2xl shadow-xl border border-border/60 backdrop-blur-md bg-white/80">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-foreground">
              {t("userDetails.profileCard.title")}
            </CardTitle>
            {getRoleBadge(user.role)}
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("userDetails.profileCard.username")}
                </p>
                <p className="text-base font-semibold">{user.username}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("userDetails.profileCard.phone")}
                </p>
                <p className="text-base font-semibold">{user.phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("userDetails.profileCard.accountCreated")}
                </p>
                <p className="text-sm font-semibold">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t("userDetails.profileCard.lastUpdated")}
                </p>
                <p className="text-sm font-semibold">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Sections */}
      {role === Role.DRIVER && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold tracking-tight">{t("userDetails.driverSection.title")}</h2>
          </div>
          <DriverVehicle driverId={userId} />
        </div>
      )}

      {role === Role.CUSTOMER && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold tracking-tight">{t("userDetails.customerSection.title")}</h2>
          </div>
          <CustomerOrders userId={userId} />
        </div>
      )}

    </div>
  );
}