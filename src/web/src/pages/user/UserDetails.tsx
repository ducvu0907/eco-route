import { useGetUserById } from "@/hooks/useUser";
import { useParams } from "react-router";
import NotFound from "../NotFound";
import { Role } from "@/types/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DriverVehicle from "@/components/user/DriverVehicle";
import UserOrders from "@/components/user/UserOrders";
import { formatDate } from "@/utils/formatDate";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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

  if (isUserLoading) return <Skeleton className="w-full h-32" />;

  if (isUserError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load user details. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user) return <NotFound />;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>Username:</strong> {user.username}</div>
          <div><strong>Phone:</strong> {user.phone}</div>
          <div><strong>Role:</strong> {user.role}</div>
          <div><strong>Created At:</strong> {formatDate(user.createdAt)}</div>
          <div><strong>Updated At:</strong> {formatDate(user.updatedAt)}</div>
        </CardContent>
      </Card>

      {role === Role.DRIVER && (
        <DriverVehicle driverId={userId} />
      )}

      {role === Role.CUSTOMER && (
        <UserOrders userId={userId} />
      )}
    </div>
  );
}
