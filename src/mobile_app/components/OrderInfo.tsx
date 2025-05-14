import { View, Text, ActivityIndicator } from "react-native";
import { useGetOrderById } from "@/hooks/useOrder";
import { formatDate } from "@/utils/formatDate";

interface OrderInfoProps {
  orderId: string;
}

export default function OrderInfo({ orderId }: OrderInfoProps) {
  const { data, isLoading, isError } = useGetOrderById(orderId);
  const order = data?.result;

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-2 text-base">Loading order...</Text>
      </View>
    );
  }

  if (isError || !order) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-base">Failed to load order.</Text>
      </View>
    );
  }

  return (
    <View className="p-4 rounded-xl bg-white shadow space-y-2">
      <Text className="text-xl font-semibold">Order Information</Text>
      <Text><Text className="font-semibold">Address:</Text> {order.address}</Text>
      <Text><Text className="font-semibold">Weight:</Text> {order.weight} kg</Text>
      <Text><Text className="font-semibold">Status:</Text> {order.status}</Text>
      <Text><Text className="font-semibold">Created At:</Text> {formatDate(order.createdAt)}</Text>
      {order.completedAt && (
        <Text><Text className="font-semibold">Completed At:</Text> {formatDate(order.completedAt)}</Text>
      )}
    </View>
  );
}
