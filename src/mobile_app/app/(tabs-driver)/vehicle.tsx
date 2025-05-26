import React, { useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VehicleInfo from "@/components/VehicleInfo";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetVehicleByDriverId } from "@/hooks/useVehicle";
import { VehicleResponse, VehicleStatus, VehicleType, TrashCategory } from "@/types/types";
import InProgressDriverMap from "@/components/InProgressDriverMap";
import DemoInProgressDriverMap from "@/components/DemoInProgressDriverMap";
import { formatDate } from "@/utils/formatDate";

export default function VehicleDetails() {
  const { userId } = useAuthContext();
  const { data, isLoading, isError } = useGetVehicleByDriverId(userId || "");
  const vehicle = data?.result;
  const [showMap, setShowMap] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-500">Loading vehicle data...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-lg text-red-600 text-center">Error loading vehicle data</Text>
        <Text className="text-sm text-gray-500 text-center mt-2">Please try again later</Text>
      </View>
    );
  }

  if (!vehicle) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-lg text-gray-600 text-center">No vehicle assigned</Text>
        <Text className="text-sm text-gray-500 text-center mt-2">
          Contact your manager to get a vehicle assigned
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <DemoInProgressDriverMap vehicle={vehicle} />
    </SafeAreaView>
  );
}