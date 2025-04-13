import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="bg-dark">
      <Text className="text-xl text-blue-600">
        Hello from NativeWind 👋
      </Text>
      <Text className="mt-2 text-gray-600 dark:text-gray-400">
        Edit <Text className="font-bold">app/index.tsx</Text> to change this screen.
      </Text>
    </View>
  );
}
