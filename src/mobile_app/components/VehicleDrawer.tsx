import { VehicleResponse } from "@/types/types";
import { View, Text } from "react-native";

interface VehicleDrawerProps {
  vehicle: VehicleResponse;
}

export default function VehicleDrawer({ vehicle }: VehicleDrawerProps) {
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
        Driver Info
      </Text>

      <Text style={{ fontSize: 14, marginBottom: 4 }}>
        <Text style={{ fontWeight: "bold" }}>Name: </Text>
        {vehicle.driver.username}
      </Text>

      <Text style={{ fontSize: 14, marginBottom: 4 }}>
        <Text style={{ fontWeight: "bold" }}>Phone: </Text>
        {vehicle.driver.phone}
      </Text>

      <Text style={{ fontSize: 14, marginBottom: 4 }}>
        <Text style={{ fontWeight: "bold" }}>License Plate: </Text>
        {vehicle.licensePlate}
      </Text>

      <Text style={{ fontSize: 14, marginBottom: 4 }}>
        <Text style={{ fontWeight: "bold" }}>Capacity: </Text>
        {vehicle.capacity} kg
      </Text>

      <Text style={{ fontSize: 14, marginBottom: 4 }}>
        <Text style={{ fontWeight: "bold" }}>Current Load: </Text>
        {vehicle.currentLoad} kg
      </Text>

      <Text style={{ fontSize: 14 }}>
        <Text style={{ fontWeight: "bold" }}>Status: </Text>
        {vehicle.status}
      </Text>
    </View>
  );
}
