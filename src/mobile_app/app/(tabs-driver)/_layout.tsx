import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Role } from "@/types/types";
import { Redirect } from "expo-router";
import { useTranslation } from "react-i18next"; // Assuming you are using react-i18next

export default function TabsDriverLayout() {
  const { t } = useTranslation();

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
          tabBarLabel: t("driverTabs.vehicle"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-sport-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="current-route"
        options={{
          tabBarLabel: t("driverTabs.currentRoute"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="navigate-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: t("driverTabs.notifications"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="driver-info"
        options={{
          tabBarLabel: t("driverTabs.info"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}