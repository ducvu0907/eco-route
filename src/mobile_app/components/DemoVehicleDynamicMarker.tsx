import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { Callout, MarkerView } from "@maplibre/maplibre-react-native";
import { VehicleResponse } from "@/types/types";
import { useVehicleRealtimeData } from "@/hooks/useVehicleRealtimeData";

interface VehicleDynamicMarkerProps {
  vehicle: VehicleResponse;
}

export default function DemoVehicleDynamicMarker({ vehicle }: VehicleDynamicMarkerProps) {
  const { data } = useVehicleRealtimeData(vehicle.id);

  return (
    <MarkerView
      coordinate={[data?.longitude || vehicle.currentLongitude, data?.latitude || vehicle.currentLatitude]}
    >
      <View className="flex-1">
        <Image
          source={require("@/assets/images/truck-icon.png")}
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />

      </View>
    </MarkerView>
  );
}
