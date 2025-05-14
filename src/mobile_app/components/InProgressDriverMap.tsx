import { useGetVehicleActiveRoute } from "@/hooks/useRoute";
import { OrderResponse, VehicleResponse } from "@/types/types";
import { View, ActivityIndicator, Text } from "react-native";
import MapView from "react-native-maps";
import OrderMarker from "./OrderMarker";
import VehicleDynamicMarker from "./VehicleDynamicMarker";
import { useEffect } from "react";
import { useWriteVehicleRealtimeData } from "@/hooks/useWriteVehicleRealtimeData";
import * as Location from "expo-location";
import { useToast } from "@/hooks/useToast";
import VehicleMarker from "./VehicleMarker";
import RoutePolyline from "./RoutePolyline";

interface InProgressDriverMapProps {
  vehicle: VehicleResponse;
}

export default function InProgressDriverMap({vehicle}: InProgressDriverMapProps) {
  const { showToast } = useToast();
  // const { writeVehicleRealtimeData } = useWriteVehicleRealtimeData();
  const {data, isLoading} = useGetVehicleActiveRoute(vehicle.id); 
  const route = data?.result;

  useEffect(() => {
    let intervalId: number;

    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast("Location permission not granted", "error");
        return;
      }

      intervalId = setInterval(async () => {
        const loc = await Location.getLastKnownPositionAsync({});
        if (loc) {
          // await writeVehicleRealtimeData({
          //   vehicleId: vehicle.id,
          //   lat: loc.coords.latitude,
          //   lon: loc.coords.longitude
          // });
        }
      }, 3000); // every 3 seconds

    };

    startLocationUpdates();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

 if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-500">Loading active route...</Text>
      </View>
    );
  }

  if (!route) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-600">Failed to load active route. Please try again.</Text>
      </View>
    );
  }

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: vehicle.currentLatitude,
        longitude: vehicle.currentLongitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <VehicleMarker vehicle={vehicle}/>

      {route.orders.map((order: OrderResponse) => (
        <OrderMarker key={order.id} order={order} />
      ))}

      <RoutePolyline vehicle={vehicle} route={route}/>

    </MapView>
  );
}