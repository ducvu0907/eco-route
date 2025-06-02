import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { TrashCategory, VehicleResponse, VehicleStatus, VehicleType } from "@/types/types";
import { formatDate } from "@/utils/formatDate";
import { useGetDepotById } from "@/hooks/useDepot"; // Not used in the provided code
import { useTranslation } from "react-i18next"; // Import useTranslation

interface VehicleInfoProps {
  vehicle: VehicleResponse;
}

export default function VehicleInfo({ vehicle }: VehicleInfoProps) {
  const { t } = useTranslation(); // Initialize useTranslation

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.ACTIVE:
        return "bg-green-100 text-green-700 border-green-200";
      case VehicleStatus.IDLE:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case VehicleStatus.REPAIR:
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeColor = (type: VehicleType) => {
    switch (type) {
      case VehicleType.THREE_WHEELER:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case VehicleType.COMPACTOR_TRUCK:
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getCategoryColor = (category: TrashCategory) => {
    switch (category) {
      case TrashCategory.GENERAL:
        return "bg-gray-50 text-gray-700 border-gray-200";
      case TrashCategory.ORGANIC:
        return "bg-green-50 text-green-700 border-green-200";
      case TrashCategory.RECYCLABLE:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case TrashCategory.HAZARDOUS:
        return "bg-red-50 text-red-700 border-red-200";
      case TrashCategory.ELECTRONIC:
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const loadPercentage = (vehicle.currentLoad / vehicle.capacity) * 100;
  const isVehicleActive = vehicle.status === VehicleStatus.ACTIVE;

  const getLoadColor = (percentage: number) => {
    if (percentage > 80) return "bg-red-500";
    if (percentage > 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getLoadTextColor = (percentage: number) => {
    if (percentage > 80) return "text-red-600";
    if (percentage > 60) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="p-4 space-y-4">

        {/* Main Vehicle Card */}
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <View className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-black mb-1">{vehicle.licensePlate}</Text>
                <Text className="text-blue-100 text-sm">{t("VehicleInfo.licensePlateNumber")}</Text>
              </View>
              <View className={`px-4 py-2 rounded-full border ${getStatusColor(vehicle.status)}`}>
                <Text className="font-semibold text-sm">{t(`VehicleInfo.status_${vehicle.status.toLowerCase()}`)}</Text>
              </View>
            </View>
          </View>

          {/* Vehicle Details */}
          <View className="p-6 space-y-6">
            {/* Type and Category */}
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{t("VehicleInfo.vehicleType")}</Text>
                <View className={`px-3 py-2 rounded-lg border ${getTypeColor(vehicle.type)}`}>
                  <Text className="text-sm font-medium text-center">{t(`VehicleInfo.type_${vehicle.type.toLowerCase()}`)}</Text>
                </View>
              </View>
              <View className="flex-1">
                <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{t("VehicleInfo.category")}</Text>
                <View className={`px-3 py-2 rounded-lg border ${getCategoryColor(vehicle.category)}`}>
                  <Text className="text-sm font-medium text-center">{t(`VehicleInfo.category_${vehicle.category.toLowerCase()}`)}</Text>
                </View>
              </View>
            </View>

            {/* Load Information */}
            <View className="bg-gray-50 rounded-xl p-4">
              <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{t("VehicleInfo.currentLoad")}</Text>
              <View className="flex-row justify-between items-end mb-3">
                <Text className="text-2xl font-bold text-gray-800">
                  {t("VehicleInfo.loadValue", { current: vehicle.currentLoad, capacity: vehicle.capacity })}
                </Text>
                <Text className={`text-sm font-semibold ${getLoadTextColor(loadPercentage)}`}>
                  {t("VehicleInfo.loadPercentage", { percentage: loadPercentage.toFixed(1) })}
                </Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-3">
                <View
                  className={`h-3 rounded-full ${getLoadColor(loadPercentage)} transition-all duration-300`}
                  style={{ width: `${Math.min(loadPercentage, 100)}%` }}
                />
              </View>
              {loadPercentage > 80 && (
                <Text className="text-xs text-red-600 mt-2 font-medium">
                  {t("VehicleInfo.vehicleNearlyFull")}
                </Text>
              )}
            </View>

            {/* Driver Information */}
            <View className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <Text className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-3">{t("VehicleInfo.driverInformation")}</Text>
              <View className="flex-row items-center space-x-3">
                <View className="w-10 h-10 bg-blue-200 rounded-full items-center justify-center">
                  <Text className="text-blue-700 font-semibold">👤</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">{vehicle.driver.username}</Text>
                  <Text className="text-sm text-gray-600">{vehicle.driver.phone}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* System Information */}
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">{t("VehicleInfo.systemInformation")}</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <Text className="text-sm text-gray-600">{t("VehicleInfo.createdAt")}</Text>
              <Text className="text-sm font-medium text-gray-800">{formatDate(vehicle.createdAt)}</Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-sm text-gray-600">{t("VehicleInfo.lastUpdated")}</Text>
              <Text className="text-sm font-medium text-gray-800">{formatDate(vehicle.updatedAt)}</Text>
            </View>
          </View>
        </View>

        {/* Activity Status */}
        <View className={`rounded-2xl p-4 border ${isVehicleActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
          <View className="flex-row items-center space-x-3">
            <View className={`w-3 h-3 rounded-full ${isVehicleActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            <Text className={`font-medium ${isVehicleActive ? 'text-green-700' : 'text-gray-600'}`}>
              {isVehicleActive ? t("VehicleInfo.vehicleIsActive") : t("VehicleInfo.vehicleIsNotActive")}
            </Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}