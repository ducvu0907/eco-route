import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import VehicleCreateModal from "@/components/vehicle/VehicleCreateModal";
import { useDeleteVehicle, useGetVehicles } from "@/hooks/useVehicle";
import { TrashCategory, VehicleResponse, VehicleStatus, VehicleType } from "@/types/types";
import { formatDate } from "@/utils/formatDate";
import {
  Activity,
  AlertTriangle,
  Clock,
  Eye,
  Filter,
  Package,
  Plus,
  Trash2,
  Truck,
  TruckIcon,
  Wrench,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

export default function VehicleManagement() {
  const { t } = useTranslation();
  const [typeFilter, setTypeFilter] = useState<VehicleType | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<TrashCategory | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "ALL">("ALL");
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { mutate: deleteVehicle, isPending } = useDeleteVehicle();
  const { data, isLoading, isError } = useGetVehicles();
  const vehicles: VehicleResponse[] = data?.result || [];

  useEffect(() => {
    const filtered = vehicles.filter((vehicle) => {
      const matchesType = typeFilter === "ALL" || vehicle.type === typeFilter;
      const matchesCategory = categoryFilter === "ALL" || vehicle.category === categoryFilter;
      const matchesStatus = statusFilter === "ALL" || vehicle.status === statusFilter;
      return matchesType && matchesCategory && matchesStatus;
    });

    setFilteredVehicles(filtered);
  }, [typeFilter, categoryFilter, statusFilter, vehicles]);

  const clearAllFilters = () => {
    setTypeFilter("ALL");
    setCategoryFilter("ALL");
    setStatusFilter("ALL");
  };

  const hasActiveFilters = typeFilter !== "ALL" || categoryFilter !== "ALL" || statusFilter !== "ALL";

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Activity className="w-4 h-4 text-green-500" />;
      case 'IDLE':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'REPAIR':
        return <Wrench className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'IDLE':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'REPAIR':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'GENERAL':
        return 'text-slate-600 bg-slate-100';
      case 'ORGANIC':
        return 'text-green-600 bg-green-100';
      case 'RECYCLABLE':
        return 'text-blue-600 bg-blue-100';
      case 'HAZARDOUS':
        return 'text-red-600 bg-red-100';
      case 'ELECTRONIC':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
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
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-red-800">{t("vehicleManagement.error.title")}</AlertTitle>
            <AlertDescription className="text-red-700">
              {t("vehicleManagement.error.description")}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <VehicleCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex flex-row items-center">
                <TruckIcon />
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 ml-3">
                  {t("vehicleManagement.header.title")}
                </h1>
              </div>
              <p className="text-gray-600">
                {t("vehicleManagement.header.subtitle", { count: vehicles.length })}
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("vehicleManagement.header.addVehicle")}
            </Button>
          </div>
        </div>
      </div>

      {/* Modern Filter Section */}
      <div className="bg-white border-b border-gray-100 sticky top-[136px] z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Filter className="w-5 h-5" />
                <span className="font-medium">{t("vehicleManagement.filters.title")}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Vehicle Type Filter */}
                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as VehicleType | "ALL")}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer min-w-[140px]"
                  >
                    <option value="ALL">{t("vehicleManagement.filters.allTypes")}</option>
                    {Object.values(VehicleType).map((type) => (
                      <option key={type} value={type}>
                        {t(`vehicleManagement.type.${type}`)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Trash Category Filter */}
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as TrashCategory | "ALL")}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer min-w-[140px]"
                  >
                    <option value="ALL">{t("vehicleManagement.filters.allCategories")}</option>
                    {Object.values(TrashCategory).map((category) => (
                      <option key={category} value={category}>
                        {t(`vehicleManagement.category.${category}`)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Vehicle Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as VehicleStatus | "ALL")}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer min-w-[140px]"
                  >
                    <option value="ALL">{t("vehicleManagement.filters.allStatuses")}</option>
                    {Object.values(VehicleStatus).map((status) => (
                      <option key={status} value={status}>
                        {t(`vehicleManagement.status.${status}`)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Active Filters & Clear Button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  {t("vehicleManagement.filters.clearFilters")}
                </Button>
              )}
              
              {/* Results Count */}
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border">
                <span className="font-medium text-gray-900">{t("vehicleManagement.filters.resultsCount.other", { count: filteredVehicles.length })}</span>
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {typeFilter !== "ALL" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
                  <span className="font-medium">{t("vehicleManagement.filters.activeFilters.type")}</span>
                  <span>{t(`vehicleManagement.type.${typeFilter}`)}</span>
                  <button
                    onClick={() => setTypeFilter("ALL")}
                    className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {categoryFilter !== "ALL" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
                  <span className="font-medium">{t("vehicleManagement.filters.activeFilters.category")}</span>
                  <span>{t(`vehicleManagement.category.${categoryFilter}`)}</span>
                  <button
                    onClick={() => setCategoryFilter("ALL")}
                    className="ml-1 hover:bg-green-100 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {statusFilter !== "ALL" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-200">
                  <span className="font-medium">{t("vehicleManagement.filters.activeFilters.status")}</span>
                  <span>{t(`vehicleManagement.status.${statusFilter}`)}</span>
                  <button
                    onClick={() => setStatusFilter("ALL")}
                    className="ml-1 hover:bg-purple-100 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Truck className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? t("vehicleManagement.emptyState.noMatchTitle") : t("vehicleManagement.emptyState.noVehiclesFoundTitle")}
            </h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters 
                ? t("vehicleManagement.emptyState.noMatchDescription") 
                : t("vehicleManagement.emptyState.noVehiclesFoundDescription")
              }
            </p>
            {hasActiveFilters ? (
              <Button 
                onClick={clearAllFilters}
                variant="outline"
                className="border-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                {t("vehicleManagement.emptyState.clearFiltersButton")}
              </Button>
            ) : (
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("vehicleManagement.emptyState.addFirstVehicleButton")}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Truck className="w-5 h-5 text-blue-600" />
                      </div>
                      {vehicle.licensePlate}
                    </CardTitle>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(vehicle.status)}`}>
                      {getStatusIcon(vehicle.status)}
                      {t(`vehicleManagement.status.${vehicle.status}`)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Package className="w-4 h-4" />
                        {t("vehicleManagement.vehicleCard.capacity")}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {vehicle.capacity.toLocaleString()} {t("vehicleManagement.vehicleCard.kg")}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{t("vehicleManagement.vehicleCard.category")}</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(vehicle.category)}`}>
                        {t(`vehicleManagement.category.${vehicle.category}`)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{t("vehicleManagement.vehicleCard.driver")}</span>
                      <Link className="font-medium text-gray-900 hover:underline" to={`/users/${vehicle.driver.id}`}>{vehicle.driver.username}</Link>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{t("vehicleManagement.vehicleCard.created")}</span>
                      <span className="text-gray-900">{formatDate(vehicle.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2">
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                      className="flex-1 border-gray-200 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {t("vehicleManagement.vehicleCard.view")}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          disabled={isPending}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("vehicleManagement.vehicleCard.deleteDialog.title")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("vehicleManagement.vehicleCard.deleteDialog.description", { licensePlate: vehicle.licensePlate })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("vehicleManagement.vehicleCard.deleteDialog.cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteVehicle(vehicle.id)}
                            disabled={isPending}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isPending ? t("vehicleManagement.vehicleCard.deleteDialog.deleting") : t("vehicleManagement.vehicleCard.deleteDialog.confirm")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}