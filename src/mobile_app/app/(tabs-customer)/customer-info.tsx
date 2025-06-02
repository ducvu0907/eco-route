import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useLogout } from "@/hooks/useAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetUserById } from "@/hooks/useUser";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserResponse, Role } from "@/types/types";
import { formatDate } from "@/utils/formatDate";
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function CustomerInfo() {
  const { t } = useTranslation(); // Initialize useTranslation
  const { userId } = useAuthContext();
  const { logout } = useLogout();
  const { data, isLoading, isError } = useGetUserById(userId || "");

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-700">{t("customerInfo.loadingUserInfo")}</Text>
        <Pressable
          onPress={logout}
          className="bg-red-500 py-3 px-6 rounded-xl mt-10 items-center"
        >
          <Text className="text-white font-semibold text-base">{t("customerInfo.logOut")}</Text>
        </Pressable>
      </View>
    );
  }

  if (isError || !data?.result) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-red-500 text-center">{t("customerInfo.failedToLoadUserInfo")}</Text>
        <Pressable
          onPress={logout}
          className="bg-red-500 py-3 px-6 rounded-xl mt-10 items-center"
        >
          <Text className="text-white font-semibold text-base">{t("customerInfo.logOut")}</Text>
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
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">{t("customerInfo.profileTitle")}</Text>
          
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">{t("customerInfo.username")}</Text>
              <Text className="text-lg font-medium text-gray-800">{user.username}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">{t("customerInfo.phoneNumber")}</Text>
              <Text className="text-lg font-medium text-gray-800">{user.phone}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">{t("customerInfo.role")}</Text>
              <View className="flex-row">
                <View className={`px-3 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                  <Text className="font-medium text-sm">{t(`customerInfo.role_${user.role.toLowerCase()}`)}</Text>
                </View>
              </View>
            </View>

            <View className="mb-2">
              <Text className="text-sm text-gray-500 mb-1">{t("customerInfo.memberSince")}</Text>
              <Text className="text-sm text-gray-600">{formatDate(user.createdAt)}</Text>
            </View>

            {user.updatedAt !== user.createdAt && (
              <View>
                <Text className="text-sm text-gray-500 mb-1">{t("customerInfo.lastUpdated")}</Text>
                <Text className="text-sm text-gray-600">{formatDate(user.updatedAt)}</Text>
              </View>
            )}
          </View>
        </View>

        <Pressable
          onPress={logout}
          className="bg-red-500 py-4 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-base">{t("customerInfo.logOut")}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}