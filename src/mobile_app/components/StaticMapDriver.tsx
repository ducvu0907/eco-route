import vehicle from "@/app/(tabs-driver)/vehicle";
import { OrderResponse, RouteResponse } from "@/types/types";
import { mapTileUrl, defaultMapZoom } from "@/utils/config";
import { Camera, MapView } from "@maplibre/maplibre-react-native";
import { useRef, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import DemoOrderMarker from "./DemoOrderMarker";
import DemoRoutePolyline from "./DemoRoutePolyline";
import DemoVehicleDynamicMarker from "./DemoVehicleDynamicMarker";
import { useGetDepotById } from "@/hooks/useDepot";
import DepotMarker from "./DepotMarker";

interface StaticMapDriverProps {
  route: RouteResponse;
}

export default function StaticMapDriver({route}: StaticMapDriverProps) {
  const cameraRef = useRef<any>(null);
  const vehicle = route.vehicle;
  const { data, isLoading } = useGetDepotById(vehicle.depotId);
  const depot = data?.result;

  if (isLoading) {
    return (
      <View className="flex-1">
        <ActivityIndicator size={24}/>
      </View>
    );
  }
  
  return (
    <View className="flex-1 relative">
      <MapView style={{ flex: 1 }} mapStyle={mapTileUrl}>
        <Camera
          ref={cameraRef}
          centerCoordinate={[(depot?.longitude as number), (depot?.latitude as number)]}
          zoomLevel={defaultMapZoom}
        />


        {depot && <DepotMarker depot={depot}/>}

        {route.orders.map((order: OrderResponse) => (
          <DemoOrderMarker key={order.id} order={order} />
        ))}


        <DemoRoutePolyline route={route} />
      </MapView>

    </View>
  );
}