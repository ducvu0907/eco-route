import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { Callout, Marker } from "react-native-maps";
import { VehicleResponse } from "@/types/types";
import { useVehicleRealtimeData } from "@/hooks/useVehicleRealtimeData";

interface VehicleDynamicMarkerProps {
  vehicle: VehicleResponse;
}

export default function VehicleDynamicMarker({ vehicle }: VehicleDynamicMarkerProps) {
  const { data } = useVehicleRealtimeData(vehicle.id);

  return (
    <Marker
      coordinate={{
        latitude: data?.latitude || vehicle.currentLatitude,
        longitude: data?.longitude || vehicle.currentLongitude,
      }}
      title="Vehicle"
    >
      <Image
        source={require("@/assets/images/truck-icon.png")}
        style={{ width: 30, height: 30 }}
        resizeMode="contain"
      />

      <Callout>
        <View>
          <Text>{vehicle.licensePlate}</Text>
          <Text>{data?.load || vehicle.currentLoad}</Text>
        </View>
      </Callout>
    </Marker>
  );
}
