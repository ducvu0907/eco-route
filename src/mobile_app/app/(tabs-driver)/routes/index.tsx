import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetRoutesByVehicleId } from "@/hooks/useRoute";
import { useGetVehicleByDriverId } from "@/hooks/useVehicle";
import { ActivityIndicator, View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback, useMemo } from "react";
import { RouteStatus, RouteResponse, OrderStatus } from "@/types/types";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next"; // Import useTranslation

const getStatusColor = (status: RouteStatus) => {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: RouteStatus) => {
  switch (status) {
    case "IN_PROGRESS":
      return "time-outline";
    case "COMPLETED":
      return "checkmark-circle-outline";
    default:
      return "help-circle-outline";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  // Using 'en-US' for consistency with previous code.
  // For localized date formatting, you might want to use i18n.language here
  // or a more robust date formatting library like 'date-fns' with i18n locales.
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDistance = (distance: number) => {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)} km`;
  }
  return `${distance.toFixed(0)} m`;
};

const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const RouteCard = ({ route, onPress }: { route: RouteResponse; onPress: () => void }) => {
  const { t } = useTranslation(); // Use useTranslation in RouteCard
  const completedOrders = route.orders.filter(order => order.status === "COMPLETED").length;
  const pendingOrders = route.orders.filter(order => order.status === "PENDING").length;
  const totalOrders = route.orders.length;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            {t("routesScreen.routeNumber", { number: route.id.slice(-6).toUpperCase() })}
          </Text>
          <Text className="text-sm text-gray-500">
            {t("routesScreen.created")}{" "}{formatDate(route.createdAt)}
          </Text>
        </View>
        
        <View className={`px-3 py-1 rounded-full flex-row items-center ${getStatusColor(route.status)}`}>
          <Ionicons 
            name={getStatusIcon(route.status) as any} 
            size={14} 
            color={route.status === "COMPLETED" ? "#065f46" : "#1e40af"} 
            style={{ marginRight: 4 }}
          />
          <Text className={`text-xs font-medium ${route.status === "COMPLETED" ? "text-green-800" : "text-blue-800"}`}>
            {t(`routesScreen.status_${route.status.toLowerCase().replace("_", "")}`)}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-1">
            {formatDistance(route.distance)}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-1">
            {formatDuration(route.duration)}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Ionicons name="list-outline" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-1">
            {t("routesScreen.ordersCount", { completed: completedOrders, total: totalOrders })}
          </Text>
        </View>
      </View>

      {route.status === "IN_PROGRESS" && (
        <View className="bg-blue-50 rounded-lg p-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-sm font-medium text-blue-900">{t("routesScreen.progress")}</Text>
            <Text className="text-sm font-semibold text-blue-900">
              {Math.round((completedOrders / totalOrders) * 100)}%
            </Text>
          </View>
          <View className="bg-blue-200 rounded-full h-2 mt-2">
            <View 
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${(completedOrders / totalOrders) * 100}%` }}
            />
          </View>
        </View>
      )}

      {route.status === "COMPLETED" && route.completedAt && (
        <View className="bg-green-50 rounded-lg p-3 flex-row items-center">
          <Ionicons name="checkmark-circle" size={20} color="#059669" />
          <Text className="text-sm text-green-800 ml-2 font-medium">
            {t("routesScreen.completedOn")}{" "}{formatDate(route.completedAt)}
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <View className="flex-row items-center">
          <Ionicons name="car-outline" size={16} color="#6b7280" />
          <Text className="text-sm text-gray-600 ml-1">
            {route.vehicle.licensePlate}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Text className="text-sm text-blue-600 font-medium">{t("routesScreen.viewDetails")}</Text>
          <Ionicons name="chevron-forward" size={16} color="#2563eb" style={{ marginLeft: 4 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function Routes() {
  const { t } = useTranslation(); // Initialize useTranslation hook
  const router = useRouter();
  const { userId } = useAuthContext();
  const [refreshing, setRefreshing] = useState(false);
  
  const { data: vehicleData, isLoading: isVehicleLoading, refetch: refetchVehicle } = useGetVehicleByDriverId(userId as string);
  const vehicle = vehicleData?.result;
  
  const { data: routesData, isLoading: isRoutesLoading, refetch: refetchRoutes } = useGetRoutesByVehicleId(vehicle?.id as string);
  const routes = routesData?.result;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchVehicle(), refetchRoutes()]);
    setRefreshing(false);
  }, [refetchVehicle, refetchRoutes]);

  const handleRoutePress = (route: RouteResponse) => {
    router.push(`/routes/${route.id}`);
  };

  const stats = useMemo(() => {
    if (!routes) return null;
    let totalOrders = 0;
    let completed = 0;
    let cancelled = 0;
    let totalDistance = 0;
    let totalDuration = 0;

    routes.forEach(route => {
      totalDistance += route.distance;
      totalDuration += route.duration;
      route.orders.forEach(order => {
        totalOrders++;
        if (order.status === OrderStatus.COMPLETED) completed++;
        if (order.status === OrderStatus.CANCELLED) cancelled++;
      });
    });

    return {
      totalOrders,
      completed,
      cancelled,
      completionRate: totalOrders ? Math.round((completed / totalOrders) * 100) : 0,
      cancelledRate: totalOrders ? Math.round((cancelled / totalOrders) * 100) : 0,
      totalDistance,
      totalDuration
    };
  }, [routes]);

  if (isVehicleLoading || isRoutesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-600 mt-4 text-base">{t("routesScreen.loadingRoutes")}</Text>
      </SafeAreaView>
    );
  }

  if (vehicle === null) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-6">
        <Ionicons name="car-outline" size={64} color="#9ca3af" />
        <Text className="text-xl font-semibold text-gray-900 mt-4 text-center">
          {t("routesScreen.noVehicleAssigned")}
        </Text>
        <Text className="text-gray-600 mt-2 text-center leading-6">
          {t("routesScreen.noVehicleAssignedMessage")}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">{t("routesScreen.myRoutes")}</Text>
        <Text className="text-gray-600 mt-1">
          {t("routesScreen.vehicleInfo", { licensePlate: vehicle?.licensePlate, count: routes?.length ?? 0 })}
        </Text>
        {stats && (
          <View className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <Text className="text-lg font-semibold text-blue-800 mb-3">{t("routesScreen.routeSummary")}</Text>
            <View className="flex-row flex-wrap justify-between">
              <View className="w-1/2 mb-2">
                <Text className="text-sm text-gray-700">
                  <Text className="font-medium">{t("routesScreen.totalOrders")}:</Text> {stats.totalOrders}
                </Text>
              </View>
              <View className="w-1/2 mb-2">
                <Text className="text-sm text-green-700">
                  <Text className="font-medium">{t("routesScreen.completed")}:</Text> {stats.completed} ({stats.completionRate}%)
                </Text>
              </View>
              <View className="w-1/2 mb-2">
                <Text className="text-sm text-gray-700">
                  <Text className="font-medium">{t("routesScreen.totalDistance")}:</Text> {formatDistance(stats.totalDistance)}
                </Text>
              </View>
              <View className="w-1/2 mb-2">
                <Text className="text-sm text-red-600">
                  <Text className="font-medium">{t("routesScreen.cancelled")}:</Text> {stats.cancelled} ({stats.cancelledRate}%)
                </Text>
              </View>
              <View className="w-full mb-2">
                <Text className="text-sm text-gray-700">
                  <Text className="font-medium">{t("routesScreen.totalDuration")}:</Text> {formatDuration(stats.totalDuration)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RouteCard 
            route={item} 
            onPress={() => handleRoutePress(item)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563eb"]}
            tintColor="#2563eb"
          />
        }
      />
    </SafeAreaView>
  );
}