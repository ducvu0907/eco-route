import { useMarkRouteAsDone } from "@/hooks/useRoute";
import { RouteResponse, RouteStatus, OrderStatus, OrderResponse } from "@/types/types";
import { View, TouchableOpacity, Text, ActivityIndicator, Animated, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const { height: screenHeight } = Dimensions.get('window');

interface RouteDrawerProps {
  route: RouteResponse;
  onSelectOrder: (order: OrderResponse) => void;
}

export default function RouteDrawer({ route, onSelectOrder }: RouteDrawerProps) {
  const queryClient = useQueryClient();
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
      tension: 65,
      friction: 8,
    }).start();
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMarkAsDone = () => {
    if (isPending || !canCompleteRoute) return;
    
    markAsDone(route.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["routes", "current"]});
      },
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins.toFixed(0)}m`;
    }
    return `${mins.toFixed(0)}m`;
  };

  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return <Ionicons name="checkmark-circle" size={16} color="#16a34a" />;
      case OrderStatus.IN_PROGRESS:
        return <Ionicons name="play-circle" size={16} color="#3b82f6" />;
      default:
        return <Ionicons name="ellipse-outline" size={16} color="#9ca3af" />;
    }
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: isExpanded ? screenHeight * 0.75 : 'auto',
        transform: [{ translateY: slideAnim }],
        zIndex: 1000,
      }}
      className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-200"
    >
      {/* Drag Handle */}
      <TouchableOpacity 
        onPress={toggleExpanded}
        className="items-center py-3"
        activeOpacity={0.7}
      >
        <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </TouchableOpacity>

      <View className="px-4 pb-4">
        {/* Compact Header */}
        <TouchableOpacity 
          onPress={toggleExpanded}
          className="flex-row items-center justify-between mb-3"
          activeOpacity={0.7}
        >
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900 mb-1">
              Current Route
            </Text>
            <View className="flex-row items-center">
              <Text className="text-gray-600 text-sm font-medium mr-2">
                {completedOrders}/{totalOrders} completed
              </Text>
              <View className={`px-2 py-0.5 rounded-full ${
                route.status === RouteStatus.COMPLETED ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  route.status === RouteStatus.COMPLETED ? 'text-green-700' : 'text-blue-700'
                }`}>
                  {route.status === RouteStatus.COMPLETED ? 'Done' : 'Active'}
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

        {/* Compact Progress Bar */}
        <View className="mb-4">
          <View className="w-full bg-gray-200 rounded-full h-2">
            <View 
              className={`h-2 rounded-full ${progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
          <Text className="text-gray-500 text-xs mt-1 text-center">
            {progressPercentage.toFixed(0)}% complete
          </Text>
        </View>

        {/* Expanded Content */}
        {isExpanded && (
          <>
            {/* Route Stats */}
            <View className="flex-row mb-4">
              <View className="flex-1 mr-1.5">
                <View className="bg-blue-50 rounded-xl p-3">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="map" size={14} color="#3b82f6" />
                    <Text className="text-blue-700 font-medium text-xs ml-1">Distance</Text>
                  </View>
                  <Text className="text-gray-800 font-semibold">
                    {route.distance.toFixed(1)} km
                  </Text>
                </View>
              </View>

              <View className="flex-1 ml-1.5">
                <View className="bg-orange-50 rounded-xl p-3">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="time" size={14} color="#f97316" />
                    <Text className="text-orange-700 font-medium text-xs ml-1">Duration</Text>
                  </View>
                  <Text className="text-gray-800 font-semibold">
                    {formatDuration(route.duration)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Scrollable Order List */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2 text-sm">Orders ({totalOrders})</Text>
              <ScrollView 
                style={{ maxHeight: screenHeight * 0.3 }}
                showsVerticalScrollIndicator={true}
                bounces={true}
                contentContainerStyle={{ paddingBottom: 8 }}
              >
                {route.orders.map((order, index) => (
                  <TouchableOpacity key={order.id} className="flex-row items-center mb-2 bg-gray-50 rounded-lg p-3" onPress={() => onSelectOrder(order)}>
                    <View className="mr-3">
                      {getOrderStatusIcon(order.status)}
                    </View>
                    <View className="flex-1 min-w-0">
                      <Text className="text-gray-800 font-medium text-sm" numberOfLines={1}>
                        #{index + 1} • {order.address}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {order.weight} kg • {order.category.toLowerCase().replace('_', ' ')}
                      </Text>
                    </View>
                    <View className={`px-2 py-1 rounded-full ml-2 ${
                      order.status === OrderStatus.COMPLETED ? 'bg-green-100' : 
                      order.status === OrderStatus.IN_PROGRESS ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Text className={`text-xs font-medium ${
                        order.status === OrderStatus.COMPLETED ? 'text-green-700' : 
                        order.status === OrderStatus.IN_PROGRESS ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {order.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Complete Route Button */}
            {canCompleteRoute && route.status !== RouteStatus.COMPLETED && (
              <TouchableOpacity
                className={`rounded-xl py-3 ${isPending ? 'bg-gray-400' : 'bg-green-500'}`}
                onPress={handleMarkAsDone}
                disabled={isPending}
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-center">
                  {isPending ? (
                    <>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text className="text-white font-semibold ml-2">
                        Completing Route...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="checkmark-done" size={18} color="#fff" />
                      <Text className="text-white font-semibold ml-2">
                        Complete Route
                      </Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            )}

            {!canCompleteRoute && route.status !== RouteStatus.COMPLETED && (
              <View className="bg-gray-100 rounded-xl py-3 px-4">
                <Text className="text-gray-600 text-center text-sm">
                  Complete all orders to finish this route
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </Animated.View>
  );
}