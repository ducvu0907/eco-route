import { useNavigate, useParams } from "react-router";
import { useGetDepotById } from "@/hooks/useDepot";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NotFound from "../NotFound";
import { formatDate } from "@/utils/formatDate";
import VehicleCreateModal from "../../components/vehicle/VehicleCreateModal";
import { useState } from "react";
import DepotUpdatemodal from "@/components/depot/DepotUpdateModal";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Calendar,
  Truck,
  Plus,
  Edit,
  Eye,
  Package,
  Gauge,
  Navigation,
  Clock,
  AlertCircle,
  Building2
} from "lucide-react";

export default function DepotDetails() {
  const navigate = useNavigate();
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { depotId } = useParams<string>();
  const { t } = useTranslation();

  if (!depotId) {
    return <NotFound />;
  }

  const { data, isLoading, isError } = useGetDepotById(depotId);
  const depot = data?.result;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-80 rounded-lg" />
          <div className="lg:col-span-2">
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("depotDetails.error.title")}</AlertTitle>
          <AlertDescription>{t("depotDetails.error.description")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!depot) {
    return <NotFound />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
      case "IDLE": return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
      case "REPAIR": return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
      default: return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
    }
  };

  const activeVehicles = depot.vehicles.filter(v => v.status === "ACTIVE").length;
  const totalLoad = depot.vehicles.reduce((sum, v) => sum + (v.currentLoad || 0), 0);
  const averageLoad = depot.vehicles.length > 0 ? totalLoad / depot.vehicles.length : 0;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <DepotUpdatemodal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} depot={depot} />

      <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{t("depotDetails.overview.title")}</h1>
              <p className="text-gray-600 mt-1">{t("depotDetails.overview.subtitle")}</p>
            </div>
          </div>
        </div>
        <Button onClick={() => setIsUpdateOpen(true)} className="gap-2 px-6">
          <Edit className="h-4 w-4" />
          {t("depotDetails.actions.editDepot")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{depot.vehicles.length}</p>
                <p className="text-sm font-medium text-gray-600">{t("depotDetails.metrics.totalVehicles")}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeVehicles}</p>
                <p className="text-sm font-medium text-gray-600">{t("depotDetails.metrics.activeVehicles")}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <Gauge className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalLoad.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-600">{t("depotDetails.metrics.totalLoad")}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-full">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{Math.round(averageLoad)}</p>
                <p className="text-sm font-medium text-gray-600">{t("depotDetails.metrics.avgLoad")}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Gauge className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
              {t("depotDetails.info.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{t("depotDetails.info.address")}</p>
                  <p className="text-sm text-gray-600 break-words">{depot.address || t("depotDetails.info.noAddress")}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Navigation className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{t("depotDetails.info.coordinates")}</p>
                  <p className="text-sm text-gray-600 font-mono">
                    {depot.latitude?.toFixed(6)}, {depot.longitude?.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{t("depotDetails.info.created")}</p>
                  <p className="text-sm text-gray-600">{formatDate(depot.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{t("depotDetails.info.updated")}</p>
                  <p className="text-sm text-gray-600">{formatDate(depot.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col max-h-[600px]">
          <CardHeader className="flex-shrink-0 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                  {t("depotDetails.vehicles.title", { count: depot.vehicles.length })}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{t("depotDetails.vehicles.subtitle")}</p>
              </div>
              <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                {t("depotDetails.actions.addVehicle")}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden">
            {depot.vehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Truck className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t("depotDetails.vehicles.empty.title")}</h3>
                <p className="text-gray-600 mb-6 max-w-sm">{t("depotDetails.vehicles.empty.description")}</p>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t("depotDetails.actions.addFirstVehicle")}
                </Button>
              </div>
            ) : (
              <div className="h-full overflow-y-auto pr-2 space-y-4">
                {depot.vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="border hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              {t("depotDetails.vehicle.licensePlate")}
                            </p>
                            <p className="font-semibold text-gray-900">{vehicle.licensePlate}</p>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              {t("depotDetails.vehicle.status")}
                            </p>
                            <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                              {vehicle.status}
                            </Badge>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              {t("depotDetails.vehicle.loadStatus")}
                            </p>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-900">
                                {vehicle.currentLoad ?? 0} / {vehicle.capacity} kg
                              </p>
                              {vehicle.currentLoad && (
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                                    style={{ 
                                      width: `${Math.min((vehicle.currentLoad / vehicle.capacity) * 100, 100)}%` 
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                              {t("depotDetails.vehicle.location")}
                            </p>
                            <p className="text-sm text-gray-600 font-mono">
                              {vehicle.currentLatitude && vehicle.currentLongitude
                                ? `${vehicle.currentLatitude.toFixed(4)}, ${vehicle.currentLongitude.toFixed(4)}`
                                : t("depotDetails.vehicle.unknown")}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 lg:flex-col lg:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                            className="gap-2 flex-1 lg:flex-none"
                          >
                            <Eye className="h-4 w-4" />
                            {t("depotDetails.actions.details")}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <VehicleCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} depot={depot} />
    </div>
  );
}