import { useGetRouteById } from "@/hooks/useRoute";
import { OrderResponse } from "@/types/types";
import { Camera, MapView, MarkerView } from "@maplibre/maplibre-react-native";
import OrderMarker from "./OrderMarker";
import VehicleDynamicMarker from "./VehicleDynamicMarker";
import { View, ActivityIndicator, Text } from "react-native";
import VehicleMarker from "./VehicleMarker";
import DemoOrderMarker from "./DemoOrderMarker";
import DemoVehicleMarker from "./DemoVehicleMarker";
import { defaultMapZoom, mapTileUrl } from "@/utils/config";
import DemoVehicleDynamicMarker from "./DemoVehicleDynamicMarker";
import VehicleDrawer from "./VehicleDrawer";

interface InProgressMapProps {
  order: OrderResponse;
}

export default function DemoInProgressCustomerMap({order}: InProgressMapProps) {
  const {data, isLoading} = useGetRouteById(order.routeId || "");
  const route = data?.result;
  const vehicle = route?.vehicle;

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
          centerCoordinate={[order.longitude, order.latitude]}
          zoomLevel={defaultMapZoom}
        />

        <DemoOrderMarker order={order} />

        <DemoVehicleDynamicMarker vehicle={vehicle} />

      </MapView>

      <VehicleDrawer vehicle={vehicle}/>
    </View>
  );
}