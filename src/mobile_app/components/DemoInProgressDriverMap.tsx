import { OrderResponse, OrderStatus, VehicleResponse } from "@/types/types";
import { View, ActivityIndicator, Text, Modal, TouchableOpacity } from "react-native";
import { Camera, MapView } from "@maplibre/maplibre-react-native";
import OrderMarker from "./OrderMarker";
import VehicleDynamicMarker from "./VehicleDynamicMarker";
import { useEffect, useRef, useState } from "react";
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
import { useGetVehicleCurrentRoute } from "@/hooks/useRoute";
import { Ionicons } from "@expo/vector-icons";

interface InProgressDriverMapProps {
  vehicle: VehicleResponse;
}

export default function DemoInProgressDriverMap({ vehicle }: InProgressDriverMapProps) {
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
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-base text-gray-600 font-medium">Loading active route...</Text>
      </View>
    );
  }

  if (!route) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-semibold text-red-600 text-center mb-2">
            No Active Route
          </Text>
          <Text className="text-sm text-gray-500 text-center leading-relaxed">
            Failed to load active route. Please try again or contact support if the problem persists.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 relative">
      {/* Map View */}
      <MapView
        style={{ flex: 1 }}
        mapStyle={mapTileUrl}
      >
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

        {/* Vehicle Marker */}
        <DemoVehicleDynamicMarker vehicle={vehicle} />

        {/* Order Markers */}
        {route.orders.map((order: OrderResponse) => (
          <TouchableOpacity 
            key={order.id} 
            onPress={() => handleOrderPress(order)}
            activeOpacity={0.8}
          >
            <DemoOrderMarker order={order} />
          </TouchableOpacity>
        ))}

        {/* Depot Marker */}
        {/* {depot && <DemoDepotMarker depot={depot} />} */}

        {/* Route Polyline */}
        <DemoRoutePolyline route={route} />
      </MapView>

      {/* Order Drawer */}
      {selectedOrder ? (
        <OrderDrawer 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      ) : (
        <RouteDrawer route={route} onSelectOrder={setSelectedOrder}/>
      )}

      <View className="absolute top-0">
        <TouchableOpacity
          onPress={() => cameraRef.current?.flyTo(vehicleData ? [vehicleData.longitude, vehicleData.latitude] : [vehicle.currentLongitude, vehicle.currentLatitude])}
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