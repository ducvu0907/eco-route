import { View, Text, Image } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { DepotResponse } from "@/types/types";

interface DepotMarkerProps {
  depot: DepotResponse;
}

export default function DepotMarker({ depot }: DepotMarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: depot.latitude,
        longitude: depot.longitude,
      }}
      title="Depot"
    >
      <Image
        source={require("@/assets/images/depot-icon.png")}
        style={{ width: 30, height: 30 }}
        resizeMode="contain"
      />

      <Callout style={{width: 200}}>
        <View>
          <Text className="font-semibold">Depot</Text>
          <Text>Address: {depot.address}</Text>
          <Text>Vehicles: {depot.vehicles.length}</Text>
        </View>
      </Callout>
    </Marker>
  );
}
