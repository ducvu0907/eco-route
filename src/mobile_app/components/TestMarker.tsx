import { MarkerView } from "@maplibre/maplibre-react-native";
import { Image } from "react-native";

interface TestMarkerProps {
  lat: number;  
  lon: number;  
}

export default function TestMarker({lat, lon}: TestMarkerProps) {
  return (
    <MarkerView coordinate={[lon, lat]}>
      <Image
        source={require("@/assets/images/truck-icon.png")}
        style={{ width: 30, height: 30 }}
        resizeMode="contain"
      />
    </MarkerView>
  );
}