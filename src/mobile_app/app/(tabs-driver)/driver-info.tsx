import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useLogout } from "@/hooks/useAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetUserById } from "@/hooks/useUser";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DriverInfo() {
  const { userId } = useAuthContext();
  const { logout } = useLogout();
  const { data, isLoading, isError } = useGetUserById(userId || "");

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-700">Loading user info...</Text>
      </View>
    );
  }

  if (isError || !data?.result) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">Failed to load user info.</Text>
      </View>
    );
  }

  const user = data.result;

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-white p-4 justify-between">
        <View>
          <Text className="text-2xl font-bold text-gray-800 mb-4">My Info</Text>
          <View className="space-y-2">
            <Text className="text-gray-700">Username: {user.username}</Text>
            <Text className="text-gray-700">Phone: {user.phone}</Text>
            <Text className="text-gray-700">Role: {user.role}</Text>
          </View>
        </View>

        <Pressable
          onPress={logout}
          className="bg-red-500 py-3 rounded-xl mt-10 items-center"
        >
          <Text className="text-white font-semibold text-base">Log Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
