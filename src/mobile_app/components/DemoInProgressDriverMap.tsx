import { OrderResponse, RouteStatus, VehicleResponse } from "@/types/types";
import { View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { Camera, MapView } from "@maplibre/maplibre-react-native";
import DemoOrderMarker from "./DemoOrderMarker";
import DemoVehicleDynamicMarker from "./DemoVehicleDynamicMarker";
import DemoRoutePolyline from "./DemoRoutePolyline";
import OrderDrawer from "./OrderDrawer";
import RouteDrawer from "./RouteDrawer";
import { useEffect, useRef, useState } from "react";
import { useWriteVehicleRealtimeData } from "@/hooks/useWriteVehicleRealtimeData";
import * as Location from "expo-location";
import { useToast } from "@/hooks/useToast";
import { useGetDepotById } from "@/hooks/useDepot";
import { useGetVehicleCurrentRoute } from "@/hooks/useRoute";
import { useVehicleRealtimeData } from "@/hooks/useVehicleRealtimeData";
import { defaultMapZoom, mapTileUrl } from "@/utils/config";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface InProgressDriverMapProps {
  vehicle: VehicleResponse;
}

export default function DemoInProgressDriverMap({ vehicle }: InProgressDriverMapProps) {
  const { t } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const { showToast } = useToast();
  const { writeVehicleRealtimeData } = useWriteVehicleRealtimeData();
  const { data: depotData, isLoading: depotLoading } = useGetDepotById(vehicle.depotId);
  const { data, isLoading } = useGetVehicleCurrentRoute(vehicle.id);
  const { data: vehicleData, loading } = useVehicleRealtimeData(vehicle.id);
  const route = data?.result;
  const depot = depotData?.result;
  const cameraRef = useRef<any>(null);

  const handleOrderPress = (order: OrderResponse) => {
    setSelectedOrder(order);
  };

  useEffect(() => {
    let intervalId: number;

    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast(t("map.locationPermissionDenied"), "error");
        return;
      }

      intervalId = setInterval(async () => {
        const loc = await Location.getLastKnownPositionAsync({});
        if (loc) {
          await writeVehicleRealtimeData({
            vehicleId: vehicle.id,
            lat: loc.coords.latitude,
            lon: loc.coords.longitude
          });
        }
      }, 10000);
    };

    // Disabled for demo
    // startLocationUpdates();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  if (isLoading || loading || depotLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-base text-gray-600 font-medium">{t("map.loading")}</Text>
      </View>
    );
  }

  if (!route || route.status === RouteStatus.COMPLETED) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-red-600 text-center mb-2">
            {t("map.noRouteTitle")}
          </Text>
          <Text className="text-sm text-gray-500 text-center leading-relaxed">
            {t("map.noRouteMessage")}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 relative">
      <MapView style={{ flex: 1 }} mapStyle={mapTileUrl}>
        <Camera
          ref={cameraRef}
          centerCoordinate={
            selectedOrder
              ? [selectedOrder.longitude, selectedOrder.latitude]
              : [
                  vehicleData?.longitude || vehicle.currentLongitude,
                  vehicleData?.latitude || vehicle.currentLatitude
                ]
          }
          zoomLevel={defaultMapZoom}
        />

        <DemoVehicleDynamicMarker vehicle={vehicle} />

        {route.orders.sort((a, b) => a.index! - b.index!).map((order: OrderResponse) => (
          <TouchableOpacity key={order.id} onPress={() => handleOrderPress(order)} activeOpacity={0.8}>
            <DemoOrderMarker order={order} />
          </TouchableOpacity>
        ))}

        <DemoRoutePolyline route={route} />
      </MapView>

      {selectedOrder ? (
        <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      ) : (
        <RouteDrawer route={route} onSelectOrder={setSelectedOrder} />
      )}

      <View className="absolute top-0">
        <TouchableOpacity
          onPress={() =>
            cameraRef.current?.flyTo(
              vehicleData
                ? [vehicleData.longitude, vehicleData.latitude]
                : [vehicle.currentLongitude, vehicle.currentLatitude]
            )
          }
          style={{
            backgroundColor: "white",
            padding: 10,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3
          }}
        >
          <Ionicons name="map" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
