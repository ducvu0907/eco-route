import { useParams } from "react-router";
import { useGetUserById } from "@/hooks/useUser";
import { Role } from "@/types/types";
import NotFound from "../NotFound";
import DriverVehicle from "@/components/user/DriverVehicle";
import UserOrders from "@/components/user/UserOrders";
import { formatDate } from "@/utils/formatDate";
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

export default function UserDetails() {
  const { userId } = useParams<string>();
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
          <AlertTitle className="font-semibold">Error</AlertTitle>
          <AlertDescription>
            Failed to load user details. Please try again later.
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
            Manager
          </Badge>
        );
      case Role.DRIVER:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Truck className="w-4 h-4" />
            Driver
          </Badge>
        );
      case Role.CUSTOMER:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            Customer
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <User className="w-4 h-4" />
            Unknown
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
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-muted-foreground text-sm">
            Manage and view full profile and data
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card className="rounded-2xl shadow-xl border border-border/60 backdrop-blur-md bg-white/80">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-foreground">
              Profile Information
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
                  Username
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
                  Phone
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
                  Account Created
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
                  Last Updated
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
            <h2 className="text-xl font-semibold tracking-tight">Vehicle Assignment</h2>
          </div>
          <DriverVehicle driverId={userId} />
        </div>
      )}

      {role === Role.CUSTOMER && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold tracking-tight">Order History</h2>
          </div>
          <UserOrders userId={userId} />
        </div>
      )}
    </div>
  );
}
