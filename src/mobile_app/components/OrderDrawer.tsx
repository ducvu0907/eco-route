import { useMarkOrderAsCancelled, useMarkOrderAsDone, useMarkOrderAsReassigned } from "@/hooks/useOrder";
import { OrderResponse, OrderStatus, TrashCategory } from "@/types/types";
import { View, TouchableOpacity, Text, ActivityIndicator, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

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

export default function OrderDrawer({ order, onClose }: OrderDrawerProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: markAsDone, isPending: isMarkingAsDone } = useMarkOrderAsDone();
  const { mutate: reassign, isPending: isMarkingAsReassigned } = useMarkOrderAsReassigned();
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
      toValue: 300,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      onClose();
    });
  };

  const handleMarkAsReassigned = () => {
    reassign(order.id, {
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
        maxHeight: "40%",
        transform: [{ translateY: slideAnim }],
      }}
      className="bg-white rounded-t-3xl shadow-2xl"
    >
      {/* Handle */}
      <TouchableOpacity
        onPress={handleClose}
        className="items-center py-3"
        activeOpacity={0.7}
      >
        <View className="w-12 h-1 bg-gray-300 rounded-full" />
      </TouchableOpacity>

      <View className="px-4 pb-6">
        {/* Header with Address and Category/Weight inline */}
        <View className="mb-4">
          {/* Address */}
          <View className="flex-row items-center mb-3">
            <View className="bg-blue-100 rounded-full p-2 mr-3">
              <Ionicons name="location" size={16} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-blue-600 font-medium text-xs mb-1">
                {t("OrderDrawer.pickupAddress")}
              </Text>
              <Text className="text-gray-800 font-medium text-sm leading-4" numberOfLines={2}>
                {order.address}
              </Text>
            </View>
          </View>

          {/* Category and Weight - Horizontal Layout */}
          <View className="flex-row justify-between">
            <View className="flex-1 flex-row items-center bg-gray-50 rounded-xl p-3 mr-2">
              <Ionicons
                name={getCategoryIcon(order.category) as any}
                size={16}
                color={getCategoryColor(order.category)}
              />
              <View className="ml-2 flex-1">
                <Text className="text-gray-500 text-xs font-medium">
                  {t("OrderDrawer.category")}
                </Text>
                <Text className="text-gray-800 font-semibold text-sm capitalize" numberOfLines={1}>
                  {t(`OrderDrawer.category_${order.category.toLowerCase()}`)}
                </Text>
              </View>
            </View>

            <View className="flex-1 flex-row items-center bg-orange-50 rounded-xl p-3 ml-2">
              <Ionicons name="scale" size={16} color="#f97316" />
              <View className="ml-2 flex-1">
                <Text className="text-gray-500 text-xs font-medium">
                  {t("OrderDrawer.weight")}
                </Text>
                <Text className="text-gray-800 font-semibold text-sm">
                  {t("OrderDrawer.weightValue", { weight: order.weight })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description - Compact */}
        {order.description && (
          <View className="flex-row items-start bg-purple-50 rounded-xl p-3 mb-4">
            <Ionicons name="document-text" size={16} color="#8b5cf6" />
            <View className="ml-2 flex-1">
              <Text className="text-purple-600 font-medium text-xs mb-1">
                {t("OrderDrawer.description")}
              </Text>
              <Text className="text-gray-800 text-sm leading-4" numberOfLines={2}>
                {order.description}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons - Compact */}
        {order.status !== OrderStatus.COMPLETED && (
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className={`flex-1 rounded-xl ${isMarkingAsDone ? 'bg-gray-400' : 'bg-green-500'} py-3`}
              onPress={handleMarkAsDone}
              disabled={isMarkingAsDone}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center">
                {isMarkingAsDone ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text className="text-white font-semibold ml-2 text-sm">
                      {t("OrderDrawer.markOrderAsDone")}
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 rounded-xl ${isMarkingAsReassigned ? 'bg-gray-400' : 'bg-red-500'} py-3`}
              onPress={handleMarkAsReassigned}
              disabled={isMarkingAsReassigned}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center justify-center">
                {isMarkingAsReassigned ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="alert-circle" size={18} color="#fff" />
                    <Text className="text-white font-semibold ml-2 text-sm">
                      {t("OrderDrawer.markOrderAsReassigned")}
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