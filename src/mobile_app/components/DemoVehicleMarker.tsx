import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { Callout, MarkerView } from "@maplibre/maplibre-react-native";
import { VehicleResponse } from "@/types/types";

interface VehicleMarkerProps {
  vehicle: VehicleResponse;
}

export default function DemoVehicleMarker({ vehicle }: VehicleMarkerProps) {
  return (
    <MarkerView
      coordinate={[vehicle.currentLongitude, vehicle.currentLatitude]}
    >
      <TouchableOpacity
      >
        <Image
          source={require("@/assets/images/truck-icon.png")}
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />

      </TouchableOpacity>
    </MarkerView>
  );
}
