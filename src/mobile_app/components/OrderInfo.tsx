import { View, Text, ActivityIndicator } from "react-native";
import { useGetOrderById } from "@/hooks/useOrder";
import { formatDate } from "@/utils/formatDate";
import { Ionicons } from "@expo/vector-icons";
import { OrderStatus, TrashCategory } from "@/types/types";

interface OrderInfoProps {
  orderId: string;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case OrderStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800";
    case OrderStatus.COMPLETED:
      return "bg-green-100 text-green-800";
    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
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

export default function OrderInfo({ orderId }: OrderInfoProps) {
  const { data, isLoading, isError } = useGetOrderById(orderId);
  const order = data?.result;

  if (isLoading) {
    return (
      <View className="mx-4 my-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <View className="flex-row items-center justify-center">
            <ActivityIndicator size="small" color="#3b82f6" className="mr-3" />
            <Text className="text-gray-600 font-medium">
              Loading order information...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (isError || !order) {
    return (
      <View className="mx-4 my-6">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <View className="bg-red-50 rounded-full w-12 h-12 items-center justify-center mx-auto mb-3">
            <Ionicons name="alert-circle" size={24} color="#ef4444" />
          </View>
          <Text className="text-gray-800 text-center font-semibold mb-1">
            Failed to load order
          </Text>
          <Text className="text-gray-500 text-center text-sm">
            Please try refreshing the page
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mx-4 my-6">
      <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <View className="p-6 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 text-xl font-bold">
              Order Information
            </Text>
            <View className={`px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
              <Text className="font-semibold text-xs uppercase tracking-wide">
                {order.status.replace('_', ' ')}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pb-6">
          {/* Address */}
          <View className="mb-5">
            <View className="flex-row items-start mb-2">
              <View className="bg-blue-50 rounded-full p-2 mr-3">
                <Ionicons name="location" size={16} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-500 text-sm font-medium mb-1">
                  Pickup Address
                </Text>
                <Text className="text-gray-900 font-medium leading-5">
                  {order.address}
                </Text>
              </View>
            </View>
          </View>

          {/* Category and Weight */}
          <View className="flex-row mb-5">
            <View className="flex-1 mr-3">
              <View className="flex-row items-center mb-2">
                <View className="bg-gray-50 rounded-full p-2 mr-3">
                  <Ionicons 
                    name={getCategoryIcon(order.category) as any} 
                    size={16} 
                    color={getCategoryColor(order.category)} 
                  />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm font-medium">
                    Category
                  </Text>
                  <Text className="text-gray-900 font-medium capitalize">
                    {order.category.toLowerCase().replace('_', ' ')}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-1 ml-3">
              <View className="flex-row items-center mb-2">
                <View className="bg-orange-50 rounded-full p-2 mr-3">
                  <Ionicons name="scale" size={16} color="#f97316" />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm font-medium">
                    Weight
                  </Text>
                  <Text className="text-gray-900 font-medium">
                    {order.weight} kg
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          {order.description && (
            <View className="mb-5">
              <View className="flex-row items-start mb-2">
                <View className="bg-purple-50 rounded-full p-2 mr-3">
                  <Ionicons name="document-text" size={16} color="#8b5cf6" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm font-medium mb-1">
                    Description
                  </Text>
                  <Text className="text-gray-900 leading-5">
                    {order.description}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Timestamps */}
          <View className="border-t border-gray-100 pt-5">
            <View className="flex-row items-center mb-3">
              <View className="bg-green-50 rounded-full p-2 mr-3">
                <Ionicons name="time" size={16} color="#16a34a" />
              </View>
              <View>
                <Text className="text-gray-500 text-sm font-medium">
                  Created At
                </Text>
                <Text className="text-gray-900 font-medium">
                  {formatDate(order.createdAt)}
                </Text>
              </View>
            </View>

            {order.completedAt && (
              <View className="flex-row items-center">
                <View className="bg-emerald-50 rounded-full p-2 mr-3">
                  <Ionicons name="checkmark-circle" size={16} color="#059669" />
                </View>
                <View>
                  <Text className="text-gray-500 text-sm font-medium">
                    Completed At
                  </Text>
                  <Text className="text-gray-900 font-medium">
                    {formatDate(order.completedAt)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}