import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useLogout } from "@/hooks/useAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetUserById } from "@/hooks/useUser";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserResponse, Role } from "@/types/types";
import { formatDate } from "@/utils/formatDate";

export default function CustomerInfo() {
  const { userId } = useAuthContext();
  const { logout } = useLogout();
  const { data, isLoading, isError } = useGetUserById(userId || "");

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-700">Loading user info...</Text>
        <Pressable
          onPress={logout}
          className="bg-red-500 py-3 px-6 rounded-xl mt-10 items-center"
        >
          <Text className="text-white font-semibold text-base">Log Out</Text>
        </Pressable>
      </View>
    );
  }

  if (isError || !data?.result) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-red-500 text-center">Failed to load user info.</Text>
        <Pressable
          onPress={logout}
          className="bg-red-500 py-3 px-6 rounded-xl mt-10 items-center"
        >
          <Text className="text-white font-semibold text-base">Log Out</Text>
        </Pressable>
      </View>
    );
  }

  const user: UserResponse = data.result;

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case Role.CUSTOMER:
        return "bg-blue-100 text-blue-800";
      case Role.DRIVER:
        return "bg-green-100 text-green-800";
      case Role.MANAGER:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4 justify-between">
        <View>
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">Profile</Text>
          
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">Username</Text>
              <Text className="text-lg font-medium text-gray-800">{user.username}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">Phone Number</Text>
              <Text className="text-lg font-medium text-gray-800">{user.phone}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">Role</Text>
              <View className="flex-row">
                <View className={`px-3 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                  <Text className="font-medium text-sm">{user.role}</Text>
                </View>
              </View>
            </View>

            {/* <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">User ID</Text>
              <Text className="text-sm font-mono text-gray-600">{user.id}</Text>
            </View> */}

            <View className="mb-2">
              <Text className="text-sm text-gray-500 mb-1">Member Since</Text>
              <Text className="text-sm text-gray-600">{formatDate(user.createdAt)}</Text>
            </View>

            {user.updatedAt !== user.createdAt && (
              <View>
                <Text className="text-sm text-gray-500 mb-1">Last Updated</Text>
                <Text className="text-sm text-gray-600">{formatDate(user.updatedAt)}</Text>
              </View>
            )}
          </View>
        </View>

        <Pressable
          onPress={logout}
          className="bg-red-500 py-4 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-base">Log Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
