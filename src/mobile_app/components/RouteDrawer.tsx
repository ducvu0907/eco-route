import { useMarkOrderAsDone } from "@/hooks/useOrder";
import { useMarkRouteAsDone } from "@/hooks/useRoute";
import { OrderResponse, RouteResponse } from "@/types/types";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface RouteDrawerProps {
  route: RouteResponse;
}

export default function RouteDrawer({route}: RouteDrawerProps) {
  const { mutate: markAsDone, isPending } = useMarkRouteAsDone();

  const handleMarkAsDone = () => {
    markAsDone(route.id, {
      onSuccess: () => {
      },
    });
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "white",
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
        Total distance: {route.distance.toFixed(3)} km
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#007bff",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
        onPress={handleMarkAsDone}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Mark Route as Done</Text>
        )}
      </TouchableOpacity>

    </View>
  );
}
