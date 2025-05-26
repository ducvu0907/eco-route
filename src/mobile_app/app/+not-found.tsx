import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gradient-to-b from-slate-50 to-white">
      {/* Background Pattern */}
      <View className="absolute inset-0 opacity-5">
        <View className="flex-1 justify-center items-center">
          <Text className="text-9xl font-black text-gray-400">404</Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-8">
        <View className="items-center">
          {/* Error Icon */}
          <View className="w-24 h-24 bg-red-100 rounded-full items-center justify-center mb-6 shadow-lg">
            <View className="w-16 h-16 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-2xl font-bold">!</Text>
            </View>
          </View>

          {/* Error Code */}
          <Text className="text-6xl font-black text-gray-800 mb-2 tracking-tight">
            404
          </Text>

          {/* Error Message */}
          <Text className="text-xl font-semibold text-gray-700 mb-3">
            Page Not Found
          </Text>

          {/* Description */}
          <Text className="text-gray-500 text-center text-base leading-6 mb-8 max-w-sm">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved or doesn't exist.
          </Text>

          {/* Action Button */}
          <Pressable
            onPress={() => router.replace("/")}
            className="bg-blue-500 active:bg-blue-600 px-8 py-4 rounded-2xl shadow-lg"
            style={{
              shadowColor: '#3B82F6',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center">
              <Text className="text-white font-semibold text-lg mr-2">
                Go Home
              </Text>
              <Text className="text-white text-lg">🏠</Text>
            </View>
          </Pressable>

          {/* Additional Help */}
          <View className="mt-8 items-center">
            <Text className="text-gray-400 text-sm mb-3">
              Need help? Try these options:
            </Text>
            <View className="flex-row space-x-6">
              <Pressable
                onPress={() => router.back()}
                className="px-4 py-2 bg-gray-100 rounded-xl"
              >
                <Text className="text-gray-600 font-medium">← Go Back</Text>
              </Pressable>
              <Pressable
                onPress={() => router.replace("/login")}
                className="px-4 py-2 bg-gray-100 rounded-xl"
              >
                <Text className="text-gray-600 font-medium">Login 👤</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="pb-8 px-8">
        <Text className="text-center text-gray-400 text-sm">
          Error Code: 404 • Page Not Found
        </Text>
      </View>
    </View>
  );
};