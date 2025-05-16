import { useMarkOrderAsDone } from "@/hooks/useOrder";
import { OrderResponse } from "@/types/types";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface OrderDrawerProps {
  order: OrderResponse;
  onClose: () => void;
}

export default function OrderDrawer({ order, onClose }: OrderDrawerProps) {
  const { mutate: markAsDone, isPending } = useMarkOrderAsDone();

  const handleMarkAsDone = () => {
    markAsDone(order.id, {
      onSuccess: () => {
        onClose();
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
        Order #{order.id}
      </Text>
      <Text style={{ marginBottom: 12 }}>{order.address}</Text>

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
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Mark Order as Done</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onClose}
        style={{ marginTop: 10, alignItems: "center" }}
      >
        <Text style={{ color: "#888" }}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}
