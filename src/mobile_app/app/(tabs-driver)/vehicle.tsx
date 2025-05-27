import VehicleInfo from "@/components/VehicleInfo";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetVehicleByDriverId } from "@/hooks/useVehicle";
import { VehicleStatus } from "@/types/types";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehicleDetails() {
  const router = useRouter();
  const { userId } = useAuthContext();
  const { data, isLoading, isError, refetch } = useGetVehicleByDriverId(userId || "");
  const vehicle = data?.result;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-6 text-lg font-medium text-gray-700">Loading vehicle data...</Text>
            <Text className="mt-2 text-sm text-gray-500">Please wait a moment</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 items-center max-w-sm">
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
              <Text className="text-red-600 text-2xl font-bold">!</Text>
            </View>
            <Text className="text-xl font-semibold text-gray-800 text-center mb-2">
              Oops! Something went wrong
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-6 leading-5">
              We couldn't load your vehicle data. Please check your connection and try again.
            </Text>
            <TouchableOpacity 
              onPress={() => refetch()}
              className="bg-blue-600 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-medium">Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 items-center max-w-sm">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-6">
              <Text className="text-blue-600 text-3xl">🚛</Text>
            </View>
            <Text className="text-xl font-semibold text-gray-800 text-center mb-3">
              No Vehicle Assigned
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-6 leading-5">
              You don't have a vehicle assigned yet. Contact your manager to get started with your assignments.
            </Text>
            <TouchableOpacity 
              onPress={() => router.back()}
              className="bg-gray-600 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-medium">Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1">
        {/* Header */}
        <SafeAreaView className="bg-white border-b border-gray-100 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-bold text-gray-800">My Vehicle</Text>
              <Text className="text-sm text-gray-500 mt-1">Current assignment details</Text>
            </View>
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
              <Text className="text-blue-600 text-xl">🚛</Text>
            </View>
          </View>
        </SafeAreaView>

        {/* Vehicle Info */}
        <VehicleInfo vehicle={vehicle} />
      </View>
    </View>
  );
}