import { View, Text, Image } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { OrderResponse, TrashCategory } from "@/types/types";
import { Image as RNImage } from "react-native";
import { useTransition } from "react";
import { useTranslation } from "react-i18next";

interface OrderMarkerProps {
  order: OrderResponse;
}

export default function OrderMarker({ order }: OrderMarkerProps) {
  const {t} = useTranslation();

  
  const getOrderIcon = (order: OrderResponse) => {
    switch (order.category) {
      case TrashCategory.ELECTRONIC:
        return "@/assets/images/electronic-trash.png";
      case TrashCategory.GENERAL:
        return "@/assets/images/general-trash.png";
      case TrashCategory.HAZARDOUS:
        return "@/assets/images/hazardous-trash.png";
      case TrashCategory.ORGANIC:
        return "@/assets/images/organic-trash.png";
      case TrashCategory.RECYCLABLE:
        return "@/assets/images/recyclable-trash.png";
    }
  };

  return (
    <Marker
      coordinate={{
        latitude: order.latitude,
        longitude: order.longitude,
      }}
      title="Order"
    >
      <Image
        source={require(getOrderIcon(order))}
        style={{ width: 30, height: 30 }}
        resizeMode="contain"
      />

      <Callout style={{width: 200}}>
        <View>
          <Text className="font-bold">
            {order.address}
          </Text>
          <Text>{t("orderMarker.weight")}: {order.weight} kg</Text>
        </View>
      </Callout>
    </Marker>
  );
}
