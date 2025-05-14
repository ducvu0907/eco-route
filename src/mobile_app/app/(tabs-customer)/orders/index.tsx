import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetOrdersByUserId } from "@/hooks/useOrder";
import { View, Text, FlatList, ActivityIndicator, Pressable, TouchableOpacity } from "react-native";
import { OrderResponse } from "@/types/types";
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

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">My Orders</Text>
          <Pressable
            className="bg-blue-500 px-4 py-2 rounded-lg"
            onPress={() => router.push("/orders/create")}
          >
            <Text className="text-white font-medium">+ New</Text>
          </Pressable>
        </View>

        {orders.length === 0 ? (
          <View className="flex-1 justify-center items-center bg-white">
            <Text>You have no orders.</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => router.push(`/orders/${item.id}`)}>
                <View className="bg-gray-100 p-4 rounded-xl mb-4 shadow-sm">
                  <Text className="font-semibold text-gray-800 mb-1">{item.address}</Text>
                  <Text className="text-gray-700">Status: {item.status}</Text>
                  <Text className="text-gray-700">Weight: {item.weight} kg</Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Created At: {formatDate(item.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
