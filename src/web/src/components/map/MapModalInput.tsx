import { 
  Dialog,
  DialogContent, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useRef, useState, useEffect } from "react";
import { 
  Marker, 
  MapContainer, 
  TileLayer, 
  LayersControl, 
  useMap, 
  useMapEvent 
} from "react-leaflet";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { MapPin, X } from "lucide-react";
import { LatLngExpression } from "leaflet";
import { defaultCenter } from "@/config/config";

interface MapInputProps {
  setLatLng: (lat: number, lng: number) => void;
}

export default function MapModalInput({ setLatLng }: MapInputProps) {
  const [lat, setLat] = useState<number>(defaultCenter[0]);
  const [lng, setLng] = useState<number>(defaultCenter[1]);
  const [isOpen, setIsOpen] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const MapClickHandler = () => {
    const map = useMap();
    mapRef.current = map;

    useMapEvent("click", (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setLat(lat);
      setLng(lng);
    });

    return null;
  };

  const onSubmit = () => {
    setLatLng(lat, lng);
    setIsOpen(false);
  };

  const handleCenterMap = () => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setIsOpen(true)}
        >
          <MapPin className="h-4 w-4" />
          Select Location on Map
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Select Location
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current coordinates display */}
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-slate-100 p-2 rounded flex items-center gap-1">
              <span className="font-medium">Lat:</span> 
              <span>{lat.toFixed(6)}</span>
            </div>
            <div className="bg-slate-100 p-2 rounded flex items-center gap-1">
              <span className="font-medium">Lng:</span> 
              <span>{lng.toFixed(6)}</span>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="ml-auto" 
              onClick={handleCenterMap}
            >
              Center Map
            </Button>
          </div>
          
          {/* Map container */}
          <div className="h-[400px] w-full rounded-md border overflow-hidden">
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

              <MapClickHandler />
              <Marker position={[lat, lng]} />

            </MapContainer>
          </div>
          
          {/* Help text */}
          <p className="text-sm text-slate-500">
            Click anywhere on the map to set the location marker.
          </p>
        </div>
        
        <DialogFooter className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-slate-500">
            Selected coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
          </div>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="default" 
              onClick={onSubmit}
            >
              Confirm Location
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}