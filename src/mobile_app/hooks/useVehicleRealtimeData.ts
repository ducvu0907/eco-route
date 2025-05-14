import { useEffect, useState } from "react";
import database from "@react-native-firebase/database";

interface VehicleRealtimeData {
  latitude: number;
  longitude: number;
  load: number;
}

export function useVehicleRealtimeData(vehicleId: string) {
  const [data, setData] = useState<VehicleRealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ref = database().ref(`/vehicles/${vehicleId}`);

    const onValueChange = ref.on("value", snapshot => {
      setData(snapshot.val());
      setLoading(false);
    }, err => {
      setError(err);
      setLoading(false);
    });

    return () => {
      ref.off("value", onValueChange);
    };
  }, [vehicleId]);

  return { data, loading, error };
}
