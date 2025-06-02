import { useMarkOrderAsCancelled, useMarkOrderAsDone } from "@/hooks/useOrder";
import { OrderResponse, OrderStatus, TrashCategory } from "@/types/types";
import { View, TouchableOpacity, Text, ActivityIndicator, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDate } from "@/utils/formatDate"; // This import is not used in the provided code
import { useEffect, useRef } from "react";
import { useWriteVehicleRealtimeData } from "@/hooks/useWriteVehicleRealtimeData"; // This import is not used in the provided code
import { useVehicleRealtimeData } from "@/hooks/useVehicleRealtimeData"; // This import is not used in the provided code
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next"; // Import useTranslation

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
  const queryClient = useQueryClient();
  const { t } = useTranslation(); // Initialize useTranslation
  const { mutate: markAsDone, isPending: isMarkingAsDone } = useMarkOrderAsDone();
  const { mutate: markAsCancelled, isPending: isMarkingAsCancelled } = useMarkOrderAsCancelled(); // This is not used in the current JSX
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

  const handleMarkAsCancelled = () => { // This function is not called in the current JSX
    markAsCancelled(order.id, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleMarkAsDone = () => {
    markAsDone(order.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["routes", "current"]});
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
        {/* Address */}
        <View className="bg-blue-50 rounded-2xl p-4 mb-4">
          <View className="flex-row items-start">
            <View className="bg-blue-100 rounded-full p-2 mr-3">
              <Ionicons name="location" size={18} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-blue-700 font-medium text-sm mb-1">
                {t("OrderDrawer.pickupAddress")}
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
                  {t("OrderDrawer.category")}
                </Text>
              </View>
              <Text className="text-gray-800 font-semibold capitalize">
                {t(`OrderDrawer.category_${order.category.toLowerCase()}`)}
              </Text>
            </View>
          </View>

          <View className="flex-1 ml-2">
            <View className="bg-orange-50 rounded-2xl p-4">
              <View className="flex-row items-center">
                <Ionicons name="scale" size={18} color="#f97316" />
                <Text className="text-gray-500 text-sm font-medium ml-2">
                  {t("OrderDrawer.weight")}
                </Text>
              </View>
              <Text className="text-gray-800 font-semibold">
                {t("OrderDrawer.weightValue", { weight: order.weight })}
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
                  {t("OrderDrawer.description")}
                </Text>
                <Text className="text-gray-800 leading-5">
                  {order.description}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {order.status !== OrderStatus.COMPLETED && (
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
                      {t("OrderDrawer.markingAsDone")}
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text className="text-white font-semibold ml-2 text-base">
                      {t("OrderDrawer.markOrderAsDone")}
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