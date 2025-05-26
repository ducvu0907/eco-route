import DemoInProgressCustomerMap from "@/components/DemoInProgressCustomerMap";
import InProgressCustomerMap from "@/components/InProgressCustomerMap";
import OrderInfo from "@/components/OrderInfo";
import { useGetOrderById } from "@/hooks/useOrder";
import { OrderStatus, TrashCategory } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, ActivityIndicator, Pressable, TouchableOpacity, ScrollView, Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { formatDate } from "@/utils/formatDate";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MIN_HEIGHT = 120;
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.7;

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 border-yellow-200";
    case OrderStatus.IN_PROGRESS:
      return "bg-blue-100 border-blue-200";
    case OrderStatus.COMPLETED:
      return "bg-green-100 border-green-200";
    case OrderStatus.CANCELLED:
      return "bg-red-100 border-red-200";
    default:
      return "bg-gray-100 border-gray-200";
  }
};

const getStatusTextColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "text-yellow-700";
    case OrderStatus.IN_PROGRESS:
      return "text-blue-700";
    case OrderStatus.COMPLETED:
      return "text-green-700";
    case OrderStatus.CANCELLED:
      return "text-red-700";
    default:
      return "text-gray-700";
  }
};

const getCategoryIcon = (category: TrashCategory) => {
  switch (category) {
    case TrashCategory.GENERAL:
      return "trash";
    case TrashCategory.ORGANIC:
      return "leaf";
    case TrashCategory.RECYCLABLE:
      return "refresh-circle";
    case TrashCategory.HAZARDOUS:
      return "warning";
    case TrashCategory.ELECTRONIC:
      return "hardware-chip";
    default:
      return "trash";
  }
};

const getCategoryColor = (category: TrashCategory) => {
  switch (category) {
    case TrashCategory.GENERAL:
      return "#6b7280";
    case TrashCategory.ORGANIC:
      return "#16a34a";
    case TrashCategory.RECYCLABLE:
      return "#3b82f6";
    case TrashCategory.HAZARDOUS:
      return "#ef4444";
    case TrashCategory.ELECTRONIC:
      return "#8b5cf6";
    default:
      return "#6b7280";
  }
};

export default function OrderDetails() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { data, isLoading } = useGetOrderById(orderId as string);
  const order = data?.result;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const slideAnim = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isExpanded ? BOTTOM_SHEET_MAX_HEIGHT : BOTTOM_SHEET_MIN_HEIGHT,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <View className="bg-white rounded-3xl p-8 shadow-sm mx-6">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-4 text-lg text-gray-600 font-medium text-center">
              Loading order details...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <View className="bg-white rounded-3xl p-8 shadow-sm mx-6">
            <View className="bg-red-50 rounded-full w-16 h-16 items-center justify-center mx-auto mb-4">
              <Ionicons name="alert-circle" size={32} color="#ef4444" />
            </View>
            <Text className="text-xl font-bold text-gray-800 text-center mb-2">
              Order Not Found
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              Failed to load order details. Please try again.
            </Text>
            <TouchableOpacity 
              onPress={() => router.back()}
              className="bg-blue-500 rounded-2xl py-3 px-6"
            >
              <Text className="text-white font-semibold text-center">Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <SafeAreaView className="bg-white shadow-sm z-10">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="bg-gray-100 rounded-full p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="flex-1 text-lg font-bold text-gray-800 text-center mx-4">
            Order #{order.index || order.id.slice(-6)}
          </Text>
          <View className={`px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
            <Text className={`font-semibold text-xs uppercase tracking-wide ${getStatusTextColor(order.status)}`}>
              {order.status.replace('_', ' ')}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Map Container */}
      <View className="flex-1">
        {order.status !== OrderStatus.PENDING ? (
          <DemoInProgressCustomerMap order={order} />
        ) : (
          <View className="flex-1 bg-gray-200 items-center justify-center">
            <View className="bg-white rounded-2xl p-6 mx-6 shadow-sm">
              <Ionicons name="map" size={48} color="#9ca3af" style={{ alignSelf: 'center' }} />
              <Text className="text-gray-500 text-center mt-3 font-medium">
                Waiting for order to be processed ...
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Sheet */}
      <Animated.View 
        style={{ 
          height: slideAnim,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
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

        {/* Quick Info */}
        <View className="px-6 pb-4">
          <TouchableOpacity 
            onPress={toggleExpanded}
            className="flex-row items-center justify-between"
            activeOpacity={0.7}
          >
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-800 mb-1">
                Order Information
              </Text>
              <Text className="text-gray-500 text-sm" numberOfLines={1}>
                {order.address}
              </Text>
            </View>
            <Ionicons 
              name={isExpanded ? "chevron-down" : "chevron-up"} 
              size={20} 
              color="#6b7280" 
            />
          </TouchableOpacity>
        </View>

        {/* Expanded Content */}
        {isExpanded && (
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* Address Section */}
            <View className="mb-6">
              <View className="flex-row items-start">
                <View className="bg-blue-50 rounded-full p-3 mr-4">
                  <Ionicons name="location" size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm font-medium mb-1">
                    Pickup Address
                  </Text>
                  <Text className="text-gray-800 font-medium text-base leading-6">
                    {order.address}
                  </Text>
                </View>
              </View>
            </View>

            {/* Category and Weight Row */}
            <View className="flex-row mb-6">
              <View className="flex-1 mr-3">
                <View className="bg-gray-50 rounded-2xl p-4">
                  <View className="flex-row items-center mb-2">
                    <Ionicons 
                      name={getCategoryIcon(order.category) as any} 
                      size={20} 
                      color={getCategoryColor(order.category)} 
                    />
                    <Text className="text-gray-500 text-sm font-medium ml-2">
                      Category
                    </Text>
                  </View>
                  <Text className="text-gray-800 font-semibold capitalize">
                    {order.category.toLowerCase().replace('_', ' ')}
                  </Text>
                </View>
              </View>

              <View className="flex-1 ml-3">
                <View className="bg-orange-50 rounded-2xl p-4">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="scale" size={20} color="#f97316" />
                    <Text className="text-gray-500 text-sm font-medium ml-2">
                      Weight
                    </Text>
                  </View>
                  <Text className="text-gray-800 font-semibold">
                    {order.weight} kg
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            {order.description && (
              <View className="mb-6">
                <View className="flex-row items-start">
                  <View className="bg-purple-50 rounded-full p-3 mr-4">
                    <Ionicons name="document-text" size={20} color="#8b5cf6" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-sm font-medium mb-2">
                      Description
                    </Text>
                    <Text className="text-gray-800 leading-6">
                      {order.description}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Timestamps */}
            <View className="border-t border-gray-100 pt-6 mb-6">
              <View className="mb-4">
                <View className="flex-row items-center">
                  <View className="bg-green-50 rounded-full p-3 mr-4">
                    <Ionicons name="time" size={20} color="#16a34a" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-sm font-medium">
                      Created At
                    </Text>
                    <Text className="text-gray-800 font-medium">
                      {formatDate(order.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>

              {order.completedAt && (
                <View className="flex-row items-center">
                  <View className="bg-emerald-50 rounded-full p-3 mr-4">
                    <Ionicons name="checkmark-circle" size={20} color="#059669" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-sm font-medium">
                      Completed At
                    </Text>
                    <Text className="text-gray-800 font-medium">
                      {formatDate(order.completedAt)}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            {order.status === OrderStatus.PENDING && (
              <View className="mb-8">
                <TouchableOpacity className="bg-red-500 rounded-2xl py-4 mb-3">
                  <Text className="text-white font-semibold text-center text-base">
                    Cancel Order
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-100 rounded-2xl py-4">
                  <Text className="text-gray-700 font-semibold text-center text-base">
                    Modify Order
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
}