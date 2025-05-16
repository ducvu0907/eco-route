import { useGetVehicleActiveRoute } from "@/hooks/useRoute";
import { OrderResponse, OrderStatus, VehicleResponse } from "@/types/types";
import { View, ActivityIndicator, Text, Modal, TouchableOpacity, Touchable } from "react-native";
import {Camera, MapView} from "@maplibre/maplibre-react-native";
import OrderMarker from "./OrderMarker";
import VehicleDynamicMarker from "./VehicleDynamicMarker";
import { useEffect, useState } from "react";
import { useWriteVehicleRealtimeData } from "@/hooks/useWriteVehicleRealtimeData";
import * as Location from "expo-location";
import { useToast } from "@/hooks/useToast";
import VehicleMarker from "./VehicleMarker";
import RoutePolyline from "./RoutePolyline";
import DemoVehicleMarker from "./DemoVehicleMarker";
import DemoOrderMarker from "./DemoOrderMarker";
import DemoRoutePolyline from "./DemoRoutePolyline";
import { defaultMapZoom, mapTileUrl } from "@/utils/config";
import { useMarkOrderAsDone } from "@/hooks/useOrder";
import DemoVehicleDynamicMarker from "./DemoVehicleDynamicMarker";
import { useVehicleRealtimeData } from "@/hooks/useVehicleRealtimeData";
import TestMarker from "./TestMarker";
import OrderDrawer from "./OrderDrawer";
import RouteDrawer from "./RouteDrawer";
import DemoDepotMarker from "./DemoDepotMarker";
import { useGetDepotById } from "@/hooks/useDepot";

interface InProgressDriverMapProps {
  vehicle: VehicleResponse;
}

export default function DemoInProgressDriverMap({vehicle}: InProgressDriverMapProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const { showToast } = useToast();
  const { writeVehicleRealtimeData } = useWriteVehicleRealtimeData();
  const {data: depotData, isLoading: depotLoading} = useGetDepotById(vehicle.depotId);
  const {data, isLoading} = useGetVehicleActiveRoute(vehicle.id); 
  const {data: vehicleData, loading} = useVehicleRealtimeData(vehicle.id);
  const route = data?.result;
  const depot = depotData?.result;

  const handleOrderPress = (order: OrderResponse) => {
    setSelectedOrder(order);
  };

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
          console.log(loc);
          await writeVehicleRealtimeData({
            vehicleId: vehicle.id,
            lat: loc.coords.latitude,
            lon: loc.coords.longitude
          });
        }
      }, 10000); // every 10 seconds

    };

    // turn off for testing
    // startLocationUpdates();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

 if (isLoading || loading || depotLoading) {
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
    <View className="flex-1">
      <MapView
        style={{ flex: 1 }}
        mapStyle={mapTileUrl}
      >

        <Camera
          centerCoordinate={selectedOrder ? [selectedOrder.longitude, selectedOrder.latitude] : [vehicleData?.longitude || vehicle.currentLongitude,
          vehicleData?.latitude || vehicle.currentLatitude]}

          zoomLevel={defaultMapZoom}
        />

        <DemoVehicleDynamicMarker vehicle={vehicle} />

        {route.orders.map((order: OrderResponse) => (
          <TouchableOpacity key={order.id} onPress={() => setSelectedOrder(order)}>
            <DemoOrderMarker order={order} />
          </TouchableOpacity>
        ))}

        
        {depot && <DemoDepotMarker depot={depot} />}

        <DemoRoutePolyline
          lon={vehicleData?.longitude}
          lat={vehicleData?.latitude}
          vehicle={vehicle}
          route={route} />


      </MapView>

      {selectedOrder && <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      {!selectedOrder && <RouteDrawer route={route} />}

    </View>
  );
}