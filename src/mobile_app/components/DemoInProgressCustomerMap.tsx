import { useGetRouteById } from "@/hooks/useRoute";
import { OrderResponse, OrderStatus } from "@/types/types";
import { Camera, MapView } from "@maplibre/maplibre-react-native";
import { View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import DemoOrderMarker from "./DemoOrderMarker";
import DemoVehicleDynamicMarker from "./DemoVehicleDynamicMarker";
import { defaultMapZoom, mapTileUrl } from "@/utils/config";
import DemoRoutePolyline from "./DemoRoutePolyline";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

interface InProgressMapProps {
  order: OrderResponse;
}

export default function DemoInProgressCustomerMap({ order }: InProgressMapProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useGetRouteById(order.routeId || "");
  const route = data?.result;
  const vehicle = route?.vehicle;
  const cameraRef = useRef<any>(null);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-base text-gray-600">{t("inProgressCustomerMap.loading")}</Text>
      </View>
    );
  }

  if (!route || !vehicle) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-lg text-red-600 text-center">{t("inProgressCustomerMap.errorTitle")}</Text>
        <Text className="text-sm text-gray-500 text-center mt-2">
          {t("inProgressCustomerMap.errorMessage")}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <MapView style={{ flex: 1 }} mapStyle={mapTileUrl}>
        <Camera
          ref={cameraRef}
          centerCoordinate={[order.longitude, order.latitude]}
          zoomLevel={defaultMapZoom}
        />

        <DemoOrderMarker order={order} />

        {order.status === OrderStatus.IN_PROGRESS && (
          <DemoVehicleDynamicMarker vehicle={vehicle} />
        )}

        <DemoRoutePolyline route={route} />
      </MapView>

      <View className="absolute top-0 left-0 m-4">
        <TouchableOpacity
          onPress={() => cameraRef.current?.flyTo([order.longitude, order.latitude])}
          style={{
            backgroundColor: "white",
            padding: 10,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons name="map" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
