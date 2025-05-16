import { View, Text, Image, TouchableOpacity } from "react-native";
import { MarkerView, Callout } from "@maplibre/maplibre-react-native";
import { OrderResponse } from "@/types/types";
import { Image as RNImage } from "react-native";

interface OrderMarkerProps {
  order: OrderResponse;
}

export default function DemoOrderMarker({ order }: OrderMarkerProps) {
  return (
    <MarkerView
      coordinate={[order.longitude, order.latitude]}
    >
        <Image
          source={require("@/assets/images/order-icon.png")}
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />

    </MarkerView>
  );
}
