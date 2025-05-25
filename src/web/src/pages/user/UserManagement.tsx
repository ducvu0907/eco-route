import { useGetUsers } from "@/hooks/useUser";
import { UserResponse } from "@/types/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  AlertTriangle, 
  User, 
  Phone, 
  Shield, 
  Calendar,
  Clock,
  UserCheck,
  Crown,
  Truck,
  ExternalLink
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { useNavigate } from "react-router";

export default function UserManagement() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetUsers();
  const users: UserResponse[] = data?.result || [];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'CUSTOMER':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'DRIVER':
        return <Truck className="w-4 h-4 text-green-500" />;
      case 'MANAGER':
        return <Crown className="w-4 h-4 text-purple-500" />;
      default:
        return <UserCheck className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'CUSTOMER':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'DRIVER':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'MANAGER':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRoleStats = () => {
    const stats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return [
      { label: 'Customers', count: stats.CUSTOMER || 0, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Drivers', count: stats.DRIVER || 0, color: 'text-green-600', bg: 'bg-green-50' },
      { label: 'Managers', count: stats.MANAGER || 0, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-32" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
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
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-red-800">Error Loading Users</AlertTitle>
            <AlertDescription className="text-red-700">
              Failed to load users. Please check your connection and try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const roleStats = getRoleStats();

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                User Management
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {roleStats.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <div className={`w-6 h-6 ${stat.color}`}>
                      {stat.label === 'Customers' && <User className="w-6 h-6" />}
                      {stat.label === 'Drivers' && <Truck className="w-6 h-6" />}
                      {stat.label === 'Managers' && <Crown className="w-6 h-6" />}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users Table */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {users.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500">Users will appear here once they're added to the system.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-gray-100">
                      <TableHead className="font-semibold text-gray-700 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          User
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Contact
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Role
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Created
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Last Updated
                        </div>
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow 
                        key={user.id} 
                        className="cursor-pointer hover:bg-gray-50/80 transition-colors border-gray-100 group" 
                        onClick={() => navigate(`/users/${user.id}`)}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{user.username}</div>
                              <div className="text-xs text-gray-500 font-mono">ID: {user.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">{user.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                            {getRoleIcon(user.role)}
                            {user.role}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {formatDate(user.updatedAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}