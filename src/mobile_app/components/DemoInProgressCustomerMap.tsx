import { useGetRouteById } from "@/hooks/useRoute";
import { OrderResponse, OrderStatus } from "@/types/types";
import { Camera, MapView, MarkerView } from "@maplibre/maplibre-react-native";
import OrderMarker from "./OrderMarker";
import VehicleDynamicMarker from "./VehicleDynamicMarker";
import { View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import VehicleMarker from "./VehicleMarker";
import DemoOrderMarker from "./DemoOrderMarker";
import DemoVehicleMarker from "./DemoVehicleMarker";
import { defaultMapZoom, mapTileUrl } from "@/utils/config";
import DemoVehicleDynamicMarker from "./DemoVehicleDynamicMarker";
import VehicleDrawer from "./VehicleDrawer";
import DemoRoutePolyline from "./DemoRoutePolyline";
import { useVehicleRealtimeData } from "@/hooks/useVehicleRealtimeData";
import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";

interface InProgressMapProps {
  order: OrderResponse;
}

export default function DemoInProgressCustomerMap({order}: InProgressMapProps) {
  const {data, isLoading} = useGetRouteById(order.routeId || "");
  const route = data?.result;
  const vehicle = route?.vehicle;
  const cameraRef = useRef<any>(null);

 if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!route || !vehicle) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading route data</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <MapView
        style={{ flex: 1 }}
        mapStyle={mapTileUrl}
      >

        <Camera
          ref={cameraRef}
          centerCoordinate={[order.longitude, order.latitude]}
          zoomLevel={defaultMapZoom}
        />

        <DemoOrderMarker order={order} />

        {order.status === OrderStatus.IN_PROGRESS && <DemoVehicleDynamicMarker vehicle={vehicle} />}

        <DemoRoutePolyline route={route} />

      </MapView>

      <View className="absolute top-0">
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