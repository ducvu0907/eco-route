import { useGetDispatches } from "@/hooks/useDispatch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import { useNavigate } from "react-router";
import { DispatchStatus } from "@/types/types";
import { 
  Truck, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Activity, 
  AlertCircle,
  Plus,
  ExternalLink,
  Search,
  Filter,
  Eye
} from "lucide-react";

export default function DispatchManagement() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetDispatches();
  const dispatches = data?.result;

  const getStatusColor = (status: DispatchStatus) => {
    switch (status) {
      case DispatchStatus.IN_PROGRESS:
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case DispatchStatus.COMPLETED:
        return "bg-green-500 hover:bg-green-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  const getStatusIcon = (status: DispatchStatus) => {
    switch (status) {
      case DispatchStatus.IN_PROGRESS:
        return <Activity className="h-3 w-3" />;
      case DispatchStatus.COMPLETED:
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Dispatches</AlertTitle>
          <AlertDescription>
            Failed to load dispatch information. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dispatch Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all dispatch operations</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dispatches/current")}
            className="flex items-center space-x-2"
          >
            <Activity className="h-4 w-4" />
            <span>Current Dispatch</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {dispatches && dispatches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Dispatches</p>
                  <p className="text-2xl font-bold text-gray-900">{dispatches.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dispatches.filter(d => d.status === DispatchStatus.COMPLETED).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Activity className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dispatches.filter(d => d.status === DispatchStatus.IN_PROGRESS).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Card */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Dispatch History</span>
            </CardTitle>
            {dispatches && dispatches.length > 0 && (
              <Badge variant="outline" className="text-sm">
                {dispatches.length} total records
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {dispatches && dispatches.length > 0 ? (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Dispatch ID</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Completed At</TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="font-semibold">Last Updated</TableHead>
                    <TableHead className="font-semibold w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dispatches.map((dispatch) => (
                    <TableRow 
                      key={dispatch.id} 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => navigate(`/dispatches/${dispatch.id}`)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-mono text-sm">#{dispatch.id.slice(-8)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(dispatch.status)} flex items-center space-x-1 w-fit`}>
                          {getStatusIcon(dispatch.status)}
                          <span>{dispatch.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {dispatch.completedAt ? (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{formatDate(dispatch.completedAt)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">Pending</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(dispatch.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(dispatch.updatedAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dispatches/${dispatch.id}`);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Truck className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Dispatches Found</h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                There are currently no dispatches in the system. Dispatches will appear here once they are created and assigned to vehicles.
              </p>
              <Button 
                onClick={() => navigate("/dispatches/current")}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>View Current Dispatch</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}