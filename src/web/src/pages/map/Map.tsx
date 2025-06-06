import { LatLngExpression } from "leaflet";
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Eye,
  Hash,
  Loader2,
  MapPin,
  Package,
  Truck,
  User,
  Weight,
  X,
  XCircle
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LayersControl, MapContainer, TileLayer, useMap } from "react-leaflet";
import { useTranslation } from "react-i18next"; // Import useTranslation

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DepotMarker from "@/components/map/DepotMarker";
import OrderMarker from "@/components/map/OrderMarker";
import VehicleDynamicMarker from "@/components/map/VehicleDynamicMarker";
import { defaultCenter } from "@/config/config";
import { useGetDepots } from "@/hooks/useDepot";
import { useGetOrders } from "@/hooks/useOrder";
import { useGetVehicles } from "@/hooks/useVehicle";
import { DepotResponse, OrderResponse, OrderStatus, TrashCategory, VehicleResponse, VehicleStatus } from "@/types/types";
import { useLocation } from "react-router";

type SelectedObject = OrderResponse | VehicleResponse | DepotResponse | null;

const statusConfig = {
  COMPLETED: { variant: 'default', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  ACTIVE: { variant: 'default', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  IN_PROGRESS: { variant: 'secondary', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
  PENDING: { variant: 'outline', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Circle },
  IDLE: { variant: 'outline', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Circle },
  CANCELLED: { variant: 'destructive', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
  REPAIR: { variant: 'destructive', color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle },
};

const categoryConfig = {
  [TrashCategory.GENERAL]: { emoji: "🗑️", color: "bg-gray-50 text-gray-700 border-gray-200" },
  [TrashCategory.ORGANIC]: { emoji: "🍃", color: "bg-green-50 text-green-700 border-green-200" },
  [TrashCategory.RECYCLABLE]: { emoji: "♻️", color: "bg-blue-50 text-blue-700 border-blue-200" },
  [TrashCategory.HAZARDOUS]: { emoji: "⚠️", color: "bg-orange-50 text-orange-700 border-orange-200" },
  [TrashCategory.ELECTRONIC]: { emoji: "🔌", color: "bg-purple-50 text-purple-700 border-purple-200" },
};

const typeConfig = {
  Depot: { icon: Building2, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  Vehicle: { icon: Truck, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Order: { icon: Package, color: "bg-orange-50 text-orange-700 border-orange-200" },
};

const getCenter = (obj: SelectedObject) => {
  const type = formatObjectType(obj);
  switch (type) {
    case "Depot":
    case "Order":
      return [(obj as DepotResponse | OrderResponse).latitude, (obj as DepotResponse | OrderResponse).longitude]
    case "Vehicle":
      return [(obj as VehicleResponse).currentLatitude, (obj as VehicleResponse).currentLongitude]
  }
}
const getStatusColor = (status: string) => statusConfig[status as keyof typeof statusConfig]?.color || 'bg-gray-50 text-gray-700 border-gray-200';
const getStatusIcon = (status: string) => statusConfig[status as keyof typeof statusConfig]?.icon || Circle;

const getCategoryConfig = (category: TrashCategory) => categoryConfig[category] || { emoji: "📦", color: "bg-gray-50 text-gray-700 border-gray-200" };

const formatObjectType = (obj: SelectedObject): string => {
  if (!obj) return "";
  if ('vehicles' in obj) return "Depot";
  if ('driver' in obj) return "Vehicle";
  return "Order";
};

const formatObjectTypei18n = (type: string): string => {
  switch (type) {
    case "Depot":
      return "map.filter.type.depots";
    case "Order":
      return "map.filter.type.orders";
    case "Vehicle":
      return "map.filter.type.vehicles";
    default:
      return "";
  }
};


const getTypeConfig = (type: string) => typeConfig[type as keyof typeof typeConfig] || { icon: MapPin, color: "bg-gray-50 text-gray-700 border-gray-200" };

interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  className?: string;
}

const InfoCard = ({ icon: Icon, label, children, className = "" }: InfoCardProps) => (
  <Card className={`transition-all duration-200 hover:shadow-md ${className}`}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100">
            <Icon className="h-4 w-4 text-gray-600" />
          </div>
          <span className="text-sm font-medium text-gray-600">{label}</span>
        </div>
        <div className="flex-shrink-0">
          {children}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}

const StatCard = ({ icon: Icon, label, value, color = "bg-blue-50 text-blue-700 border-blue-200" }: StatCardProps) => (
  <Card className="transition-all duration-200 hover:shadow-md">
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('-700', '-100')}`}>
          <Icon className={`h-4 w-4 ${color.split(' ')[1]}`} />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-600">{label}</div>
          <div className="text-lg font-semibold text-gray-900">{value}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const renderObjectDetails = (obj: SelectedObject, t: Function) => {
  if (!obj) return null;

  const type = formatObjectType(obj);
  const typeConf = getTypeConfig(type);
  const TypeIcon = typeConf.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${typeConf.color}`}>
              <TypeIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">{t(formatObjectTypei18n(type))}</div>
              <div className="text-sm text-gray-600 font-mono">{t('map.detailsPanel.order.id', { id: obj.id })}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">{t('map.detailsPanel.tabs.details')}</TabsTrigger>
          <TabsTrigger value="timeline">{t('map.detailsPanel.tabs.timeline')}</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          {type === "Order" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <InfoCard icon={AlertCircle} label={t('map.detailsPanel.order.status')}>
                  <Badge className={`${getStatusColor((obj as OrderResponse).status)} border font-medium`}>
                    {t(`map.filter.orderStatus.${(obj as OrderResponse).status.toLowerCase()}`)}
                  </Badge>
                </InfoCard>

                <InfoCard icon={Package} label={t('map.detailsPanel.order.category')}>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-md border ${getCategoryConfig((obj as OrderResponse).category).color}`}>
                    <span className="text-lg">{getCategoryConfig((obj as OrderResponse).category).emoji}</span>
                    <span className="text-sm font-medium">{t(`map.filter.category.${(obj as OrderResponse).category.toLowerCase()}`)}</span>
                  </div>
                </InfoCard>

                <InfoCard icon={Weight} label={t('map.detailsPanel.order.weight')}>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md border border-blue-200 font-semibold text-sm">
                    {(obj as OrderResponse).weight} {t('map.detailsPanel.order.weightUnit')}
                  </div>
                </InfoCard>
              </div>

              {(obj as OrderResponse).description && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600">{t('map.detailsPanel.order.description')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {(obj as OrderResponse).description}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t('map.detailsPanel.order.address')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {(obj as OrderResponse).address}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {type === "Vehicle" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <InfoCard icon={AlertCircle} label={t('map.detailsPanel.vehicle.status')}>
                  <Badge className={`${getStatusColor((obj as VehicleResponse).status)} border font-medium`}>
                    {t(`map.filter.vehicleStatus.${(obj as VehicleResponse).status.toLowerCase()}`)}
                  </Badge>
                </InfoCard>

                <InfoCard icon={Hash} label={t('map.detailsPanel.vehicle.licensePlate')}>
                  <div className="bg-gray-900 text-white px-3 py-1 rounded font-mono text-sm font-bold">
                    {(obj as VehicleResponse).licensePlate}
                  </div>
                </InfoCard>

                <InfoCard icon={Truck} label={t('map.detailsPanel.vehicle.type')}>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {t(`map.filter.vehicleType.${(obj as VehicleResponse).type.toLowerCase()}`)}
                  </span>
                </InfoCard>

                <InfoCard icon={Package} label={t('map.detailsPanel.vehicle.category')}>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-md border ${getCategoryConfig((obj as VehicleResponse).category).color}`}>
                    <span className="text-lg">{getCategoryConfig((obj as VehicleResponse).category).emoji}</span>
                    <span className="text-sm font-medium">{t(`map.filter.category.${(obj as VehicleResponse).category.toLowerCase()}`)}</span>
                  </div>
                </InfoCard>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600">{t('map.detailsPanel.vehicle.loadCapacity')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('map.detailsPanel.vehicle.currentLoad')}</span>
                      <span className="font-semibold">
                        {(obj as VehicleResponse).currentLoad} / {(obj as VehicleResponse).capacity} {t('map.detailsPanel.vehicle.capacityUnit')}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 rounded-full"
                        style={{
                          width: `${Math.min(100, (((obj as VehicleResponse).currentLoad || 0) / ((obj as VehicleResponse).capacity || 1)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('map.detailsPanel.vehicle.driverInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {(obj as VehicleResponse).driver.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-blue-900">
                        {(obj as VehicleResponse).driver.username}
                      </div>
                      <div className="text-xs text-blue-700">
                        {(obj as VehicleResponse).driver.phone}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {type === "Depot" && (
            <div className="space-y-4">
              <StatCard
                icon={Truck}
                label={t('map.detailsPanel.depot.vehicles')}
                value={t('map.detailsPanel.depot.vehiclesCount', { count: (obj as DepotResponse).vehicles.length })}
                color="bg-indigo-50 text-indigo-700 border-indigo-200"
              />

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t('map.detailsPanel.depot.address')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {(obj as DepotResponse).address}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('map.detailsPanel.timeline.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t('map.detailsPanel.timeline.created')}</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {new Date(obj.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t('map.detailsPanel.timeline.lastUpdated')}</span>
                    <span className="text-sm text-gray-900 font-medium">
                      {new Date(obj.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default function Map() {
  const { t } = useTranslation(); // Initialize useTranslation
  const location = useLocation();
  const { data: depotData, isLoading: isDepotsLoading } = useGetDepots();
  const { data: vehiclesData, isLoading: isVehiclesLoading } = useGetVehicles();
  const { data: ordersData, isLoading: isOrdersLoading } = useGetOrders();

  const depots = depotData?.result || [];
  const vehicles = vehiclesData?.result || [];
  const orders = ordersData?.result || [];

  const [selectedObject, setSelectedObject] = useState<SelectedObject>(
    location.state?.selectedObject || null
  );
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  const filteredOrders = useMemo(() => {
    return orders.filter(order =>
      (typeFilter === "ALL" || typeFilter === "ORDER") &&
      (orderStatusFilter === "ALL" || order.status === (orderStatusFilter as OrderStatus)) &&
      (categoryFilter === "ALL" || order.category === (categoryFilter as TrashCategory))
    );
  }, [orders, typeFilter, orderStatusFilter, categoryFilter]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle =>
      (typeFilter === "ALL" || typeFilter === "VEHICLE") &&
      (vehicleStatusFilter === "ALL" || vehicle.status === (vehicleStatusFilter as VehicleStatus)) &&
      (categoryFilter === "ALL" || vehicle.category === (categoryFilter as TrashCategory))
    );
  }, [vehicles, typeFilter, vehicleStatusFilter, categoryFilter]);

  const filteredDepots = useMemo(() => {
    return depots.filter(() =>
      typeFilter === "ALL" || typeFilter === "DEPOT"
    );
  }, [depots, typeFilter]);

  const MapClickHandler = () => {
    const map = useMap();

    useEffect(() => {
      if (selectedObject) {
        map.flyTo(getCenter(selectedObject) as LatLngExpression);
      }
    }, [selectedObject]);

    return null;
  }

  if (isDepotsLoading || isVehiclesLoading || isOrdersLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                <MapPin className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">{t('map.loading.title')}</h3>
              <p className="text-sm text-gray-600 max-w-sm">
                {t('map.loading.description')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full bg-gray-50">
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Enhanced Filter Bar */}
        <Card className="m-2 shadow-sm border-gray-200">
          <CardContent className="pt-0">
            <div className="flex flex-row justify-between items-center">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('map.filter.type.label')}</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t('map.filter.type.all')}</SelectItem>
                    <SelectItem value="DEPOT">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-indigo-600" />
                        {t('map.filter.type.depots')}
                      </div>
                    </SelectItem>
                    <SelectItem value="VEHICLE">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-emerald-600" />
                        {t('map.filter.type.vehicles')}
                      </div>
                    </SelectItem>
                    <SelectItem value="ORDER">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-orange-600" />
                        {t('map.filter.type.orders')}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('map.filter.orderStatus.label')}</label>
                <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                  <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t('map.filter.orderStatus.all')}</SelectItem>
                    {Object.values(OrderStatus).map(status => {
                      const StatusIcon = getStatusIcon(status);
                      return (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-3 w-3" />
                            {t(`map.filter.orderStatus.${status.toLowerCase()}`)}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('map.filter.vehicleStatus.label')}</label>
                <Select value={vehicleStatusFilter} onValueChange={setVehicleStatusFilter}>
                  <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t('map.filter.vehicleStatus.all')}</SelectItem>
                    {Object.values(VehicleStatus).map(status => {
                      const StatusIcon = getStatusIcon(status);
                      return (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-3 w-3" />
                            {t(`map.filter.vehicleStatus.${status.toLowerCase()}`)}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('map.filter.category.label')}</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">{t('map.filter.category.all')}</SelectItem>
                    {Object.values(TrashCategory).map(cat => (
                      <SelectItem key={cat} value={cat}>
                        <div className="flex items-center gap-2">
                          <span className="text-base">{getCategoryConfig(cat).emoji}</span>
                          <span>{t(`map.filter.category.${cat.toLowerCase()}`)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Container */}
        <div className="flex-1 m-2 z-0">
          <Card className="h-full overflow-hidden shadow-lg p-0">
            <MapContainer
              center={defaultCenter as LatLngExpression}
              zoom={15}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
              zoomControl={true}
            >
              <LayersControl position="topright">
                <LayersControl.BaseLayer name="Street">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite">
                  <TileLayer
                    attribution="Google Maps"
                    url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer checked name="Terrain">
                  <TileLayer
                    attribution="Google Maps"
                    url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                  />
                </LayersControl.BaseLayer>
              </LayersControl>

              {filteredDepots.map(d => (
                <DepotMarker key={d.id} depot={d} setSelected={() => setSelectedObject(d)} isSelected={selectedObject?.id === d.id}/>
              ))}

              {filteredVehicles.map(v => (
                <VehicleDynamicMarker key={v.id} vehicle={v} setSelected={() => setSelectedObject(v)} isSelected={selectedObject?.id === v.id}/>
              ))}

              {filteredOrders.map(o => (
                <OrderMarker key={o.id} order={o} setSelected={() => setSelectedObject(o)} isSelected={selectedObject?.id === o.id}/>
              ))}
            <MapClickHandler />
            </MapContainer>
          </Card>
        </div>
      </div>

      {/* Enhanced Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 shadow-xl">
        <div className="h-full flex flex-col">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2.5 rounded-xl shadow-sm">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{t('map.detailsPanel.title')}</h3>
                  {/* <p className="text-sm text-gray-600">
                    {selectedObject ? t('map.detailsPanel.subtitle.selected', { type: formatObjectType(selectedObject) }) : t('map.detailsPanel.subtitle.noSelection')}
                  </p> */}
                </div>
              </div>
              {selectedObject && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedObject(null)}
                  className="h-8 w-8 p-0 hover:bg-white/50 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                {selectedObject ? (
                  renderObjectDetails(selectedObject, t)
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full p-8 mb-6 shadow-sm">
                      <MapPin className="h-12 w-12 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">{t('map.detailsPanel.noSelection.title')}</h4>
                    <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
                      {t('map.detailsPanel.noSelection.description')}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}