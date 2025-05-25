import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteDepot, useGetDepots } from "@/hooks/useDepot";
import { DepotResponse } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  MapPin, 
  Truck, 
  Plus, 
  List, 
  Map as MapIcon, 
  Eye, 
  Trash2, 
  Warehouse,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import DepotCreateModal from "@/components/depot/DepotCreateModal";
import { useState } from "react";
import DepotsMap from "@/components/depot/DepotsMap";

export default function DepotManagement() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list'); 
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetDepots();
  const { mutate: deleteDepot, isPending: isDeleting } = useDeleteDepot();
  const depots: DepotResponse[] = data?.result || [];

  const handleViewDepot = (depot: DepotResponse) => {
    navigate(`/depots/${depot.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to load depots. Please try again later.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <DepotCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Warehouse className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Depot Management</h1>
                <p className="text-sm text-slate-600 mt-1">
                  {depots.length} depot{depots.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Depot
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                className="border-slate-200 hover:bg-slate-50 transition-all duration-200"
              >
                {viewMode === 'list' ? (
                  <>
                    <MapIcon className="w-4 h-4 mr-2" />
                    Map View
                  </>
                ) : (
                  <>
                    <List className="w-4 h-4 mr-2" />
                    List View
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto p-6">
        {viewMode === 'list' ? (
          // List View
          depots.length === 0 ? (
            <div className="text-center py-16">
              <Warehouse className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No depots found</h3>
              <p className="text-slate-600 mb-6">Get started by creating your first depot</p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Depot
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {depots.map((depot: DepotResponse) => (
                <Card 
                  key={depot.id} 
                  className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <span className="line-clamp-2 text-left leading-6">
                        {depot.address ?? "N/A"}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Location Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="text-slate-600">Latitude</div>
                        <div className="font-mono text-slate-900 mt-1">{depot.latitude}</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <div className="text-slate-600">Longitude</div>
                        <div className="font-mono text-slate-900 mt-1">{depot.longitude}</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Vehicles</span>
                      </div>
                      <span className="text-lg font-bold text-blue-700">{depot.vehicles.length}</span>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>Created {formatDate(depot.createdAt)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDepot(depot)}
                        className="flex-1 border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isDeleting}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white/95 backdrop-blur-sm">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the depot at{" "}
                              <strong className="text-slate-900">{depot.address ?? "N/A"}</strong>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-slate-200 hover:bg-slate-50">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteDepot(depot.id)}
                              disabled={isDeleting}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {isDeleting ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Deleting...
                                </div>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </>
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          // Map View
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg overflow-hidden">
            <div style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
              <DepotsMap depots={depots} />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}