import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Role } from "@/types/types";
import { Redirect } from "expo-router";

export default function TabsDriverLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
      }}
    >
      <Tabs.Screen
        name="vehicle"
        options={{
          tabBarLabel: "Your Vehicle",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-sport-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="current-route"
        options={{
          tabBarLabel: "Current Route",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="navigate-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="driver-info"
        options={{
          tabBarLabel: "Info",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
