import { View, Text, Image } from "react-native";
import { MarkerView, Callout } from "@maplibre/maplibre-react-native";
import { DepotResponse } from "@/types/types";

interface DepotMarkerProps {
  depot: DepotResponse;
}

export default function DemoDepotMarker({ depot }: DepotMarkerProps) {
  return (
    <MarkerView
      coordinate={[depot.longitude, depot.latitude]}
    >
      <View className="flex-1">
        <Image
          source={require("@/assets/images/depot-icon.png")}
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />

      </View>
    </MarkerView>
  );
}
