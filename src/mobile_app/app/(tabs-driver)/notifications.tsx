import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetNotificationsByUserId } from "@/hooks/useNotification";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NotificationResponse } from "@/types/types";
import { formatDate } from "@/utils/formatDate";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const { userId } = useAuthContext();
  const { data, isLoading } = useGetNotificationsByUserId(userId as string);
  const notifications: NotificationResponse[] = data?.result || [];

  const renderNotification = ({ item }: { item: NotificationResponse }) => (
    <TouchableOpacity 
      className={`flex-row items-start p-4 border-b border-gray-100 ${
        !item.isRead ? 'bg-blue-50' : 'bg-white'
      }`}
      activeOpacity={0.7}
    >
      <View className="mr-3 mt-1">
        <Ionicons 
          name={item.isRead ? "notifications-outline" : "notifications"} 
          size={20} 
          color={item.isRead ? "#6B7280" : "#3B82F6"} 
        />
      </View>
      
      <View className="flex-1">
        <Text className={`text-md leading-5 ${
          !item.isRead ? 'text-gray-900 font-medium' : 'text-gray-700'
        }`}>
          {item.content}
        </Text>
        
        <View className="flex-row items-center mt-2">
          <Text className="text-xs text-gray-500">
            {formatDate(item.createdAt)}
          </Text>
          {!item.isRead && (
            <View className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4 text-base">Loading notifications...</Text>
      </View>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-8">
        <Ionicons name="notifications-off-outline" size={64} color="#9CA3AF" />
        <Text className="text-xl font-semibold text-gray-700 mt-4 text-center">
          No notifications yet
        </Text>
        <Text className="text-gray-500 mt-2 text-center leading-6">
          When you receive notifications, they'll appear here
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-2">
      <SafeAreaView>
        <Text className="text-2xl font-semibold text-center">Notifications</Text>
      </SafeAreaView>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="bg-white"
      />
    </View>
  );
}