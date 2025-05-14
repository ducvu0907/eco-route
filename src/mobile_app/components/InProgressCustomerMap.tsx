import { useGetRouteById } from "@/hooks/useRoute";
import { OrderResponse } from "@/types/types";
import MapView from "react-native-maps";
import OrderMarker from "./OrderMarker";
import VehicleDynamicMarker from "./VehicleDynamicMarker";
import { View, ActivityIndicator, Text } from "react-native";
import VehicleMarker from "./VehicleMarker";

interface InProgressMapProps {
  order: OrderResponse;
}

export default function InProgressCustomerMap({order}: InProgressMapProps) {
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
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: order.latitude,
        longitude: order.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >

      <OrderMarker order={order} />

      <VehicleMarker vehicle={vehicle} />

    </MapView>
  );
}