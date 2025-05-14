import { View, Text, Button, TouchableOpacity, Modal, StyleSheet } from "react-native";
import MapView, { Marker, MapPressEvent, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

type LocationPickerProps = {
  isVisible: boolean;
  setLocation: (latitude: number, longitude: number) => void;
  onClose: () => void;
};

export default function LocationPicker({ isVisible, setLocation, onClose, }: LocationPickerProps) {
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setCurrentLocation({ latitude, longitude });
      setSelectedLocation({ latitude, longitude });
    })();
  }, []);

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleSelectLocation = () => {
    if (!selectedLocation) return;
    setLocation(selectedLocation.latitude, selectedLocation.longitude); // Update parent component with the selected location
    onClose(); // Close the modal after selection
  };

  if (!currentLocation) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Back Button */}
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Map */}
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              ...currentLocation,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={handleMapPress}
          >
            {selectedLocation && (
              <Marker coordinate={selectedLocation}>
                <Callout>
                  <Text>Selected location</Text>
                </Callout>
              </Marker>
            )}
          </MapView>

          {/* Select Location Button */}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 10,
    backgroundColor: '#00000088',
    padding: 8,
    borderRadius: 20,
  },
  selectButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
});
