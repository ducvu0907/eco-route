import { View, Text, ScrollView } from "react-native";
import { TrashCategory, VehicleResponse, VehicleStatus, VehicleType } from "@/types/types";
import { formatDate } from "@/utils/formatDate";

interface VehicleInfoProps {
  vehicle: VehicleResponse;
}

export default function VehicleInfo({ vehicle }: VehicleInfoProps) {
  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case VehicleStatus.IDLE:
        return "bg-yellow-100 text-yellow-800";
      case VehicleStatus.REPAIR:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: VehicleType) => {
    switch (type) {
      case VehicleType.THREE_WHEELER:
        return "bg-blue-100 text-blue-800";
      case VehicleType.COMPACTOR_TRUCK:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: TrashCategory) => {
    switch (category) {
      case TrashCategory.GENERAL:
        return "bg-gray-100 text-gray-800";
      case TrashCategory.ORGANIC:
        return "bg-green-100 text-green-800";
      case TrashCategory.RECYCLABLE:
        return "bg-blue-100 text-blue-800";
      case TrashCategory.HAZARDOUS:
        return "bg-red-100 text-red-800";
      case TrashCategory.ELECTRONIC:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const loadPercentage = (vehicle.currentLoad / vehicle.capacity) * 100;
  const isVehicleActive = vehicle.status === VehicleStatus.ACTIVE;

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Vehicle Info Section */}
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">Vehicle Details</Text>

        <View className="bg-gray-50 rounded-xl p-4 mb-4">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-lg font-semibold text-gray-800">{vehicle.licensePlate}</Text>
              <Text className="text-sm text-gray-600">License Plate</Text>
            </View>
            <View className={`px-3 py-1 rounded-full ${getStatusColor(vehicle.status)}`}>
              <Text className="font-medium text-sm">{vehicle.status}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-sm text-gray-500 mb-1">Vehicle Type</Text>
              <View className={`px-2 py-1 rounded ${getTypeColor(vehicle.type)} self-start`}>
                <Text className="text-xs font-medium">{vehicle.type.replace('_', ' ')}</Text>
              </View>
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-sm text-gray-500 mb-1">Category</Text>
              <View className={`px-2 py-1 rounded ${getCategoryColor(vehicle.category)} self-start`}>
                <Text className="text-xs font-medium">{vehicle.category}</Text>
              </View>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-500 mb-1">Current Load</Text>
            <Text className="text-lg font-medium text-gray-800">
              {vehicle.currentLoad} / {vehicle.capacity} kg
            </Text>
            <View className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <View
                className={`h-2 rounded-full ${loadPercentage > 80 ? 'bg-red-500' : loadPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(loadPercentage, 100)}%` }}
              />
            </View>
            <Text className="text-xs text-gray-500 mt-1">{loadPercentage.toFixed(1)}% capacity</Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-500 mb-1">Driver Information</Text>
            <Text className="text-base font-medium text-gray-800">{vehicle.driver.username}</Text>
            <Text className="text-sm text-gray-600">{vehicle.driver.phone}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm text-gray-500 mb-1">Current Location</Text>
            <Text className="text-sm text-gray-600">
              Lat: {vehicle.currentLatitude.toFixed(6)}, Lng: {vehicle.currentLongitude.toFixed(6)}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <View>
              <Text className="text-sm text-gray-500 mb-1">Created</Text>
              <Text className="text-xs text-gray-600">{formatDate(vehicle.createdAt)}</Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500 mb-1">Updated</Text>
              <Text className="text-xs text-gray-600">{formatDate(vehicle.updatedAt)}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>


  );
}
