import { View, Text, Image } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { DepotResponse } from "@/types/types";
import { useTranslation } from "react-i18next"; // Import useTranslation

interface DepotMarkerProps {
  depot: DepotResponse;
}

export default function DepotMarker({ depot }: DepotMarkerProps) {
  const { t } = useTranslation(); // Initialize useTranslation

  return (
    <Marker
      coordinate={{
        latitude: depot.latitude,
        longitude: depot.longitude,
      }}
      title={t("DepotMarker.depotTitle")} // Translate the marker title
    >
      <Image
        source={require("@/assets/images/depot-icon.png")}
        style={{ width: 30, height: 30 }}
        resizeMode="contain"
      />

      <Callout style={{width: 200}}>
        <View>
          <Text className="font-semibold">{t("DepotMarker.depotTitle")}</Text>
          <Text>{t("DepotMarker.address", { address: depot.address })}</Text>
          <Text>{t("DepotMarker.vehicles", { count: depot.vehicles.length })}</Text>
        </View>
      </Callout>
    </Marker>
  );
}