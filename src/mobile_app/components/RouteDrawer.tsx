import { useMarkRouteAsDone } from "@/hooks/useRoute";
import { RouteResponse, RouteStatus, OrderStatus } from "@/types/types";
import { View, TouchableOpacity, Text, ActivityIndicator, Animated, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useRef, useState } from "react";

interface RouteDrawerProps {
  route: RouteResponse;
}

export default function RouteDrawer({ route }: RouteDrawerProps) {
  const { mutate: markAsDone, isPending } = useMarkRouteAsDone();
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const completedOrders = route.orders.filter(order => order.status === OrderStatus.COMPLETED).length;
  const totalOrders = route.orders.length;
  const progressPercentage = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
  const canCompleteRoute = completedOrders === totalOrders && totalOrders > 0;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMarkAsDone = () => {
    markAsDone(route.id, {
      onSuccess: () => {
        // Route completed successfully
      },
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins.toFixed(1)}m`;
    }
    return `${mins.toFixed(1)}m`;
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        transform: [{ translateY: slideAnim }],
        maxHeight: isExpanded ? '70%' : 'auto',
      }}
      className="bg-white rounded-t-3xl shadow-2xl"
    >
      {/* Handle */}
      <TouchableOpacity 
        onPress={toggleExpanded}
        className="items-center py-4"
        activeOpacity={0.7}
      >
        <View className="w-12 h-1 bg-gray-300 rounded-full" />
      </TouchableOpacity>

      <View className="px-6">
        {/* Header */}
        <TouchableOpacity 
          onPress={toggleExpanded}
          className="flex-row items-center justify-between mb-4"
          activeOpacity={0.7}
        >
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800 mb-1">
              Current Route
            </Text>
            <View className="flex-row items-center">
              <Text className="text-gray-500 text-sm mr-3">
                {completedOrders}/{totalOrders} orders completed
              </Text>
              <View className={`px-2 py-1 rounded-full ${route.status === RouteStatus.COMPLETED ? 'bg-green-100' : 'bg-blue-100'}`}>
                <Text className={`text-xs font-medium ${route.status === RouteStatus.COMPLETED ? 'text-green-700' : 'text-blue-700'}`}>
                  {route.status.replace('_', ' ')}
                </Text>
              </View>
            </View>
          </View>
          <Ionicons 
            name={isExpanded ? "chevron-down" : "chevron-up"} 
            size={20} 
            color="#6b7280" 
          />
        </TouchableOpacity>

        {/* Progress Bar */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-600 font-medium">Progress</Text>
            <Text className="text-gray-500 text-sm">{progressPercentage.toFixed(0)}%</Text>
          </View>
          <View className="w-full bg-gray-200 rounded-full h-3">
            <View 
              className={`h-3 rounded-full ${progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
        </View>

        {isExpanded && (
          <View className="flex-row mb-6">
            <View className="flex-1 mr-2">
              <View className="bg-blue-50 rounded-2xl p-4">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="map" size={18} color="#3b82f6" />
                  <Text className="text-blue-700 font-medium text-sm ml-2">
                    Distance
                  </Text>
                </View>
                <Text className="text-gray-800 font-semibold text-lg">
                  {route.distance.toFixed(1)} km
                </Text>
              </View>
            </View>

            <View className="flex-1 ml-2">
              <View className="bg-orange-50 rounded-2xl p-4">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="time" size={18} color="#f97316" />
                  <Text className="text-orange-700 font-medium text-sm ml-2">
                    Duration
                  </Text>
                </View>
                <Text className="text-gray-800 font-semibold text-lg">
                  {formatDuration(route.duration)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <ScrollView className="max-h-64 mb-6" showsVerticalScrollIndicator={false}>
            <Text className="text-gray-700 font-semibold mb-3">Order List</Text>
            {route.orders.map((order, index) => (
              <View key={order.id} className="flex-row items-center mb-3 bg-gray-50 rounded-xl p-3">
                <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                  order.status === OrderStatus.COMPLETED ? 'bg-green-100' : 'bg-gray-200'
                }`}>
                  {order.status === OrderStatus.COMPLETED ? (
                    <Ionicons name="checkmark" size={16} color="#16a34a" />
                  ) : (
                    <Text className="text-gray-600 font-medium text-sm">{index + 1}</Text>
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium" numberOfLines={1}>
                    {order.address}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {order.weight} kg • {order.category}
                  </Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${
                  order.status === OrderStatus.COMPLETED ? 'bg-green-100' : 
                  order.status === OrderStatus.IN_PROGRESS ? 'bg-blue-100' : 'bg-yellow-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    order.status === OrderStatus.COMPLETED ? 'text-green-700' : 
                    order.status === OrderStatus.IN_PROGRESS ? 'text-blue-700' : 'text-yellow-700'
                  }`}>
                    {order.status === OrderStatus.COMPLETED ? 'Done' : 
                     order.status === OrderStatus.IN_PROGRESS ? 'Active' : 'Pending'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {isExpanded && (
          <View className="pb-8">
            <TouchableOpacity
              className={`rounded-2xl py-4 mb-3 ${isPending ? 'bg-gray-400' : 'bg-green-500'}`}
              onPress={handleMarkAsDone}
              disabled={isPending}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center">
                {isPending ? (
                  <>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text className="text-white font-semibold ml-2 text-base">
                      Completing Route...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-done" size={20} color="#fff" />
                    <Text className="text-white font-semibold ml-2 text-base">
                      Complete Route
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </Animated.View>
  );
}