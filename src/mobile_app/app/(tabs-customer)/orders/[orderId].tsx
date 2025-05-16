import DemoInProgressCustomerMap from "@/components/DemoInProgressCustomerMap";
import InProgressCustomerMap from "@/components/InProgressCustomerMap";
import OrderInfo from "@/components/OrderInfo";
import { useGetOrderById } from "@/hooks/useOrder";
import { OrderStatus } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, ActivityIndicator, Pressable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderDetails() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { data, isLoading } = useGetOrderById(orderId as string);
  const order = data?.result;


  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg text-gray-500">Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-600">Failed to load order details. Please try again.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View className="w-full h-full">
        <OrderInfo orderId={order.id} />
        {/* {order.status === OrderStatus.IN_PROGRESS && <InProgressCustomerMap order={order} />} */}
        {order.status === OrderStatus.IN_PROGRESS && <DemoInProgressCustomerMap order={order} />}
      </View>
    </SafeAreaView>
  );
}