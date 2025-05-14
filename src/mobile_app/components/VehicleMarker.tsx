import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { Callout, Marker } from "react-native-maps";
import { VehicleResponse } from "@/types/types";

interface VehicleMarkerProps {
  vehicle: VehicleResponse;
}

export default function VehicleMarker({ vehicle }: VehicleMarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: vehicle.currentLatitude,
        longitude: vehicle.currentLongitude,
      }}
      title="Vehicle"
    >
      <Image
        source={require("@/assets/images/truck-icon.png")}
        style={{ width: 30, height: 30 }}
        resizeMode="contain"
      />

      <Callout style={{width: 200}}>
        <View>
          <Text>{vehicle.licensePlate}</Text>
          <Text>{vehicle.currentLoad}</Text>
        </View>
      </Callout>
    </Marker>
  );
}
