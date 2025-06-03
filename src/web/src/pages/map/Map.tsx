import DepotMarker from "@/components/map/DepotMarker";
import VehicleDynamicMarker from "@/components/map/VehicleDynamicMarker";
import { Button } from "@/components/ui/button";
import { defaultCenter } from "@/config/config";
import { useGetDepots } from "@/hooks/useDepot";
import { useGetVehicles } from "@/hooks/useVehicle";
import { DepotResponse, VehicleResponse } from "@/types/types";
import { LatLngExpression } from "leaflet";
import { useState } from "react";
import { LayersControl, MapContainer, TileLayer } from "react-leaflet";

export default function Map() {
  const { data: depotData } = useGetDepots();
  const depots = depotData?.result;
  
  const { data: vehiclesData } = useGetVehicles();
  const vehicles = vehiclesData?.result;

  const [showVehicles, setShowVehicles] = useState<boolean>(true);
  const [showDepots, setShowDepots] = useState<boolean>(true);


  return (
    <div className="w-full h-full">
      <div className="absolute bottom-0 z-[1000] p-4 flex gap-2">
        <Button onClick={() => setShowVehicles(!showVehicles)}>
          {showVehicles ? "Hide Vehicles" : "Show Vehicles"}
        </Button>
        <Button onClick={() => setShowDepots(!showDepots)}>
          {showDepots ? "Hide Depots" : "Show Depots"}
        </Button>
      </div>
      <MapContainer
        center={defaultCenter as LatLngExpression}
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

        {showVehicles &&
          vehicles?.map((vehicle: VehicleResponse) => (
            <VehicleDynamicMarker key={vehicle.id} vehicle={vehicle} />
          ))}

        {showDepots &&
          depots?.map((depot: DepotResponse) => (
            <DepotMarker key={depot.id} depot={depot} />
          ))}

      </MapContainer>
    </div>
  );
}
