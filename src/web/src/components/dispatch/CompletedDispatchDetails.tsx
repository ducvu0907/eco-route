import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DispatchResponse, RouteResponse, OrderResponse } from "@/types/types";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import { useMemo } from "react";
import MultiRoutesStaticMap from "../map/MultiRoutesStaticMap";
import { Truck, Package, MapPin, Clock, CheckCircle2, Calendar } from "lucide-react";

interface CompletedDispatchDetailsProps {
  dispatch: DispatchResponse;
  routes: RouteResponse[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function CompletedDispatchDetails({ dispatch, routes }: CompletedDispatchDetailsProps) {
  const totalDistance = routes.reduce((sum, route) => sum + route.distance, 0);
  const totalOrders = routes.reduce((sum, route) => sum + route.orders.length, 0);
  const totalWeight = routes.reduce((sum, route) => 
    sum + route.orders.reduce((orderSum, order) => orderSum + order.weight, 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Header with key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={getStatusColor(dispatch.status)}>
                  {dispatch.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Routes</p>
                <p className="text-2xl font-bold">{routes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Distance</p>
                <p className="text-2xl font-bold">{totalDistance.toFixed(1)} km</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dispatch Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Dispatch Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {/* <span className="text-sm font-medium text-muted-foreground">Dispatch ID:</span>
                <Badge variant="outline">{dispatch.id}</Badge> */}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Created:</span>
              </div>
              <p className="text-sm">{new Date(dispatch.createdAt).toLocaleString()}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">Completed:</span>
              </div>
              <p className="text-sm">{new Date(dispatch.completedAt).toLocaleString()}</p>
            </div>
          </div>

          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="font-medium">Total Weight</p>
              <p className="text-lg font-bold text-primary">{totalWeight} kg</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="font-medium">Vehicles Used</p>
              <p className="text-lg font-bold text-primary">{routes.length}</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="font-medium">Avg Distance</p>
              <p className="text-lg font-bold text-primary">{(totalDistance / routes.length).toFixed(1)} km</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Routes list - left side */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Routes ({routes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-4 space-y-4">
                  {routes.map((route, i) => (
                    <Card key={route.id} className="border-l-4 border-l-primary/50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Route #{i + 1}</CardTitle>
                          <Badge className={getStatusColor(route.status)}>
                            {route.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Truck className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{route.vehicle.licensePlate}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{route.distance.toFixed(1)} km</span>
                          </div>

                          <Separator />
                          
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Orders ({route.orders.length})</span>
                            </div>
                            
                            <div className="space-y-2">
                              {route.orders
                                .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
                                .map((order, orderIndex) => (
                                  <div 
                                    key={order.id} 
                                    className="flex items-start gap-2 p-2 bg-muted/30 rounded text-xs"
                                  >
                                    <Badge variant="secondary" className="text-xs min-w-fit">
                                      #{order.index}
                                    </Badge>
                                    <div className="flex-1 min-w-0">
                                      <p className="truncate font-medium">{order.address}</p>
                                      <p className="text-muted-foreground">{order.weight}kg</p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Map - right side */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Route Visualization
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px] rounded-b-lg overflow-hidden">
                <MultiRoutesStaticMap routes={routes} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}