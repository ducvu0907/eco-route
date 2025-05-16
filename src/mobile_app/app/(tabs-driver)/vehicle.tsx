import React from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VehicleInfo from "@/components/VehicleInfo";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetVehicleByDriverId } from "@/hooks/useVehicle";
import { VehicleStatus } from "@/types/types";
import InProgressDriverMap from "@/components/InProgressDriverMap";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DemoInProgressDriverMap from "@/components/DemoInProgressDriverMap";

export default function VehicleDetails() {
  const router = useRouter();
  const { userId } = useAuthContext();
  const { data, isLoading, isError } = useGetVehicleByDriverId(userId || "");
  const vehicle = data?.result;

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-500">Loading vehicle data...</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-600">No vehicle found for this driver.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="w-full h-full">
        <VehicleInfo vehicle={vehicle} />
        {/* {vehicle.status === VehicleStatus.ACTIVE && <InProgressDriverMap vehicle={vehicle}/>} */}
        {vehicle.status === VehicleStatus.ACTIVE && <DemoInProgressDriverMap vehicle={vehicle}/>}
      </View>
    </SafeAreaView>
  );
}
