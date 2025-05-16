import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, Button, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import {Annotation, MapView, Camera, PointAnnotation, MarkerView, Callout} from "@maplibre/maplibre-react-native";
import { defaultMapZoom, mapTileUrl } from "@/utils/config";

type LocationPickerProps = {
  isVisible: boolean;
  setLocation: (latitude: number, longitude: number) => void;
  onClose: () => void;
};

export default function DemoLocationPicker({ isVisible, setLocation, onClose }: LocationPickerProps) {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      const coords: [number, number] = [loc.coords.longitude, loc.coords.latitude];
      console.log(coords);
      setCurrentLocation(coords);
      setSelectedLocation(coords);
    })();
  }, []);

  const handleMapPress = async (event: any) => {
    const coords = event.geometry.coordinates as [number, number];
    console.log(coords);
    setSelectedLocation(coords);
  };

  const handleSelectLocation = () => {
    if (!selectedLocation) return;
    setLocation(selectedLocation[1], selectedLocation[0]); // [lat, lon]
    onClose();
  };

  if (!currentLocation) return null;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Back Button */}
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <MapView
            style={styles.map}
            onPress={handleMapPress}
            mapStyle={mapTileUrl}
          >
            <Camera
              centerCoordinate={selectedLocation || currentLocation}
              zoomLevel={defaultMapZoom}
            />

            {selectedLocation && (
              <MarkerView coordinate={selectedLocation}>
                <View style={{
                  backgroundColor: "red",
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "white"
                }} />
              </MarkerView>
            )}
          </MapView>

          {/* Select Button */}
          <View style={styles.selectButtonContainer}>
            <Button title="Select Location" onPress={handleSelectLocation} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 15,
    zIndex: 10,
    backgroundColor: "#00000088",
    padding: 8,
    borderRadius: 20,
  },
  selectButtonContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
});
