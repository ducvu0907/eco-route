import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetOrdersByUserId } from "@/hooks/useOrder";
import { View, Text, FlatList, ActivityIndicator, Pressable, TouchableOpacity } from "react-native";
import { OrderResponse, TrashCategory, OrderStatus } from "@/types/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { formatDate } from "@/utils/formatDate";

export default function Orders() {
  const { userId } = useAuthContext();
  const { data, isLoading, isError } = useGetOrdersByUserId(userId || "");
  const router = useRouter();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-700">Loading orders...</Text>
      </View>
    );
  }

  if (isError || !data?.result) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">Failed to load orders. Please try again later.</Text>
      </View>
    );
  }

  const orders: OrderResponse[] = data.result;

  const getCategoryColor = (category: TrashCategory) => {
    switch (category) {
      case TrashCategory.GENERAL:
        return "bg-gray-200 text-gray-800";
      case TrashCategory.ORGANIC:
        return "bg-green-200 text-green-800";
      case TrashCategory.RECYCLABLE:
        return "bg-blue-200 text-blue-800";
      case TrashCategory.HAZARDOUS:
        return "bg-red-200 text-red-800";
      case TrashCategory.ELECTRONIC:
        return "bg-purple-200 text-purple-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "text-yellow-600";
      case OrderStatus.IN_PROGRESS:
        return "text-blue-600";
      case OrderStatus.COMPLETED:
        return "text-green-600";
      case OrderStatus.CANCELLED:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">Orders</Text>
          <Pressable
            className="bg-blue-500 px-4 py-2 rounded-lg"
            onPress={() => router.push("/orders/create")}
          >
            <Text className="text-white font-medium">+ New</Text>
          </Pressable>
        </View>

        {orders.length === 0 ? (
          <View className="flex-1 justify-center items-center bg-white">
            <Text className="text-gray-500 text-lg">You have no orders.</Text>
            <Text className="text-gray-400 text-sm mt-2">Tap "+ New" to create your first order</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => router.push(`/orders/${item.id}`)}>
                <View className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-200">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="font-semibold text-gray-800 flex-1 mr-2" numberOfLines={2}>
                      {item.address}
                    </Text>
                    <View className={`px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                      <Text className="text-xs font-medium">{item.category}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className={`font-medium ${getStatusColor(item.status)}`}>
                      Status: {item.status.replace('_', ' ')}
                    </Text>
                    <Text className="text-gray-700 font-medium">{item.weight} kg</Text>
                  </View>

                  {item.index !== null && (
                    <Text className="text-gray-600 text-sm mb-1">
                      Route Index: #{item.index}
                    </Text>
                  )}

                  {item.description && (
                    <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}

                  <Text className="text-gray-500 text-sm">
                    Created: {formatDate(item.createdAt)}
                  </Text>
                  
                  {item.completedAt && (
                    <Text className="text-green-600 text-sm">
                      Completed: {formatDate(item.completedAt)}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
