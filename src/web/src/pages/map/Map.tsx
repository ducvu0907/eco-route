import { useGetDepots } from "@/hooks/useDepot";
import { Marker, MapContainer, TileLayer, LayersControl, useMap, useMapEvent } from "react-leaflet";
import { useGetVehicles } from "@/hooks/useVehicle";
import { LatLngExpression } from "leaflet";

export default function Map() {
  const defaultCenter: LatLngExpression = [21.028346, 105.834131];
  const { data: depotData, isLoading: isDepotsLoading, isError: isDepotsError } = useGetDepots();
  const { data: vehiclesData, isLoading: isVehiclesLoading, isError: isVehiclesError } = useGetVehicles();

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


      </MapContainer>
    </div>
  );
}