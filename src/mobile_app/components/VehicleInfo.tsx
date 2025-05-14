import { View, Text } from "react-native";
import { VehicleResponse } from "@/types/types";

interface VehicleInfoProps {
  vehicle: VehicleResponse;
}

export default function VehicleInfo({ vehicle }: VehicleInfoProps) {
  return (
    <View className="p-4 rounded-xl bg-white shadow space-y-2">
      <Text className="text-xl font-semibold">Vehicle Information</Text>
      <Text><Text className="font-semibold">License Plate:</Text> {vehicle.licensePlate}</Text>
      <Text><Text className="font-semibold">Driver:</Text> {vehicle.driver.username} ({vehicle.driver.phone})</Text>
      <Text><Text className="font-semibold">Capacity:</Text> {vehicle.capacity} kg</Text>
      <Text><Text className="font-semibold">Current Load:</Text> {vehicle.currentLoad} kg</Text>
      <Text><Text className="font-semibold">Status:</Text> {vehicle.status}</Text>
    </View>
  );
}
