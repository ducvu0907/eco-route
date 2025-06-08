import { View, Text, Image } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { DepotResponse } from "@/types/types";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { MarkerView } from "@maplibre/maplibre-react-native";

interface DepotMarkerProps {
  depot: DepotResponse;
}

export default function DepotMarker({ depot }: DepotMarkerProps) {
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