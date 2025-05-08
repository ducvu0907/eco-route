import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center bg-gray-200">
      <Text className="text-4xl font-bold text-red-500 mb-4">404</Text>
      <Text className="text-lg text-gray-600 mb-6">Page Not Found</Text>
      <Button
        title="Go Home"
        onPress={() => router.replace("/")}
      />
    </View>
  );
};
