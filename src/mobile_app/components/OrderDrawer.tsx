import { useMarkOrderAsCancelled, useMarkOrderAsDone } from "@/hooks/useOrder";
import { OrderResponse, OrderStatus, TrashCategory } from "@/types/types";
import { View, TouchableOpacity, Text, ActivityIndicator, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "@/utils/formatDate";
import { useEffect, useRef } from "react";
import { useWriteVehicleRealtimeData } from "@/hooks/useWriteVehicleRealtimeData";
import { useVehicleRealtimeData } from "@/hooks/useVehicleRealtimeData";

interface OrderDrawerProps {
  order: OrderResponse;
  onClose: () => void;
}

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

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 border-yellow-200 text-yellow-700";
    case OrderStatus.IN_PROGRESS:
      return "bg-blue-100 border-blue-200 text-blue-700";
    case OrderStatus.COMPLETED:
      return "bg-green-100 border-green-200 text-green-700";
    case OrderStatus.CANCELLED:
      return "bg-red-100 border-red-200 text-red-700";
    default:
      return "bg-gray-100 border-gray-200 text-gray-700";
  }
};

export default function OrderDrawer({ order, onClose }: OrderDrawerProps) {
  const { mutate: markAsDone, isPending: isMarkingAsDone } = useMarkOrderAsDone();
  const { mutate: markAsCancelled, isPending: isMarkingAsCancelled } = useMarkOrderAsCancelled();
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      onClose();
    });
  };

  const handleMarkAsCancelled = () => {
    markAsCancelled(order.id, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleMarkAsDone = () => {
    markAsDone(order.id, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        transform: [{ translateY: slideAnim }],
      }}
      className="bg-white rounded-t-3xl shadow-2xl"
    >
      {/* Handle */}
      <TouchableOpacity
        onPress={handleClose}
        className="items-center py-4"
        activeOpacity={0.7}
      >
        <View className="w-12 h-1 bg-gray-300 rounded-full" />
      </TouchableOpacity>

      <View className="px-6 pb-8">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800 mb-1">
              Order #{order.index || order.id.slice(-6)}
            </Text>
            <View className={`self-start px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
              <Text className="font-semibold text-xs uppercase tracking-wide">
                {order.status.replace('_', ' ')}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleClose}
            className="bg-gray-100 rounded-full p-2 ml-4"
          >
            <Ionicons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Address */}
        <View className="bg-blue-50 rounded-2xl p-4 mb-4">
          <View className="flex-row items-start">
            <View className="bg-blue-100 rounded-full p-2 mr-3">
              <Ionicons name="location" size={18} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-blue-700 font-medium text-sm mb-1">
                Pickup Address
              </Text>
              <Text className="text-gray-800 font-medium leading-5">
                {order.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Category and Weight */}
        <View className="flex-row mb-6">
          <View className="flex-1 mr-2">
            <View className="bg-gray-50 rounded-2xl p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons
                  name={getCategoryIcon(order.category) as any}
                  size={18}
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

          <View className="flex-1 ml-2">
            <View className="bg-orange-50 rounded-2xl p-4">
              <View className="flex-row items-center">
                <Ionicons name="scale" size={18} color="#f97316" />
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
          <View className="bg-purple-50 rounded-2xl p-0 mb-2">
            <View className="flex-row items-start">
              <View className="bg-purple-100 rounded-full p-0 mr-3">
                <Ionicons name="document-text" size={18} color="#8b5cf6" />
              </View>
              <View className="flex-1">
                <Text className="text-purple-700 font-medium text-sm mb-1">
                  Description
                </Text>
                <Text className="text-gray-800 leading-5">
                  {order.description}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {/* {order.status !== OrderStatus.COMPLETED && (
          <View>
            <TouchableOpacity
              className={`rounded-2xl mb-1 ${isMarkingAsDone ? 'bg-gray-400' : 'bg-green-500'}`}
              onPress={handleMarkAsDone}
              disabled={isMarkingAsDone}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center py-2">
                {isMarkingAsDone ? (
                  <>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text className="text-white font-semibold ml-2 text-base">
                      Marking as Done...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text className="text-white font-semibold ml-2 text-base">
                      Mark Order as Done
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className={`rounded-2xl mb-1 ${isMarkingAsCancelled ? 'bg-gray-400' : 'bg-red-500'}`}
              onPress={handleMarkAsCancelled}
              disabled={isMarkingAsCancelled}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center py-2">
                {isMarkingAsCancelled ? (
                  <>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text className="text-white font-semibold ml-2 text-base">
                      Marking as Cancelled...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="remove-circle" size={20} color="#fff" />
                    <Text className="text-white font-semibold ml-2 text-base">
                      Cancel Order
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        )} */}

        {/* Created timestamp */}
        <View className="flex-row items-center justify-center mt-4 pt-4 border-t border-gray-100">
          <Ionicons name="time" size={16} color="#9ca3af" />
          <Text className="text-gray-500 text-sm ml-2">
            Created {formatDate(order.createdAt)}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}