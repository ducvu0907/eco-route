import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import VehicleInfo from "@/components/VehicleInfo";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetVehicleByDriverId } from "@/hooks/useVehicle";
import DemoInProgressDriverMap from "@/components/DemoInProgressDriverMap";
import { useTranslation } from "react-i18next";

export default function CurrentRouteDetails() {
  const { t } = useTranslation();
  const { userId } = useAuthContext();
  const { data, isLoading, isError } = useGetVehicleByDriverId(userId || "");
  const vehicle = data?.result;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="mt-4 text-lg text-gray-500">{t("route.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center bg-white px-4">
          <Text className="text-lg text-red-600 text-center">{t("route.errorTitle")}</Text>
          <Text className="text-sm text-gray-500 text-center mt-2">{t("route.errorSubtitle")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center items-center bg-white px-4">
          <Text className="text-lg text-gray-600 text-center">{t("route.noRoute")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <SafeAreaView className="p-0 bg-white border-b border-gray-200 z-10">
        <Text className="text-xl font-bold text-gray-800 text-center">{t("route.title")}</Text>
      </SafeAreaView>

      {/* Map Container */}
      <View className="flex-1">
        <DemoInProgressDriverMap vehicle={vehicle} />
      </View>
    </View>
  );
}
