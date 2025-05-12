import { useGetDepots } from "@/hooks/useDepot";
import { Marker, MapContainer, TileLayer, LayersControl } from "react-leaflet";
import { useGetVehicles } from "@/hooks/useVehicle";
import { LatLngExpression } from "leaflet";
import { Popup } from "react-leaflet"; // Optional: Add a popup to show info on marker click

export default function Map() {
  const defaultCenter: LatLngExpression = [21.028346, 105.834131];
  
  // Get depots data
  const { data: depotData, isLoading: isDepotsLoading, isError: isDepotsError } = useGetDepots();
  const depots = depotData?.result;
  
  // Get vehicles data
  const { data: vehiclesData, isLoading: isVehiclesLoading, isError: isVehiclesError } = useGetVehicles();
  const vehicles = vehiclesData?.result;

  return (
    <div className="w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Street">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution="Google Maps"
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked name="Terrain">
            <TileLayer
              attribution="Google Maps"
              url="https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Render depot markers */}
        {depots && !isDepotsLoading && !isDepotsError && depots.map((depot) => (
          <Marker
            key={depot.id}
            position={[depot.latitude, depot.longitude]}
          >
            <Popup>{depot.address}</Popup> {/* Optional popup with depot address */}
          </Marker>
        ))}

        {/* Render vehicle markers */}
        {vehicles && !isVehiclesLoading && !isVehiclesError && vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.currentLatitude, vehicle.currentLongitude]}
          >
            <Popup>{vehicle.licensePlate}</Popup> {/* Optional popup with vehicle license plate */}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
