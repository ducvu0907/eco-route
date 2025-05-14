import { View, Text, Image } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { OrderResponse } from "@/types/types";
import { Image as RNImage } from "react-native";

interface OrderMarkerProps {
  order: OrderResponse;
}

export default function OrderMarker({ order }: OrderMarkerProps) {
  return (
    <Marker
      coordinate={{
        latitude: order.latitude,
        longitude: order.longitude,
      }}
      title="Order"
      // image={require("@/assets/images/order-icon.png")}
    >
      <Image
        source={require("@/assets/images/order-icon.png")}
        style={{ width: 30, height: 30 }}
        resizeMode="contain"
      />

      <Callout style={{width: 200}}>
        <View>
          <Text className="font-bold">
            {order.address}
          </Text>
          <Text>Weight: {order.weight} kg</Text>
        </View>
      </Callout>
    </Marker>
  );
}
