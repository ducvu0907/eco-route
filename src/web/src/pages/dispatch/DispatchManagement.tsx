import { useGetDispatches } from "@/hooks/useDispatch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function DispatchManagement() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetDispatches();
  const dispatches = data?.result;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load dispatches. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <div className="flex flex-row justify-between px-3">
        <h1 className="text-2xl font-bold">Dispatch Management</h1>
        <Button onClick={() => navigate("/dispatches/current")}>Current dispatch</Button>
      </div>
      <CardContent>
        {dispatches && dispatches.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completed At</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dispatches.map((dispatch) => (
                <TableRow key={dispatch.id} className="cursor-pointer" onClick={() => navigate(`/dispatches/${dispatch.id}`)}>
                  <TableCell>{dispatch.id}</TableCell>
                  <TableCell>{dispatch.status}</TableCell>
                  <TableCell>{formatDate(dispatch.completedAt)}</TableCell>
                  <TableCell>{formatDate(dispatch.updatedAt)}</TableCell>
                  <TableCell>{formatDate(dispatch.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No dispatches found.</p>
        )}
      </CardContent>
    </Card>
  );
}
