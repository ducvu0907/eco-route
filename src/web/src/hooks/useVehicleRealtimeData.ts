import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { VehicleRealtimeData } from "@/types/types";
import { database } from "@/firebase";

export function useVehicleRealtimeData(vehicleId: string) {
  const [data, setData] = useState<VehicleRealtimeData | null>(null);

  useEffect(() => {
    if (!vehicleId) return;

    const vehicleRef = ref(database, `vehicles/${vehicleId}`);

    const unsubscribe = onValue(vehicleRef, (snapshot) => {
      console.log("update vehicle: ", snapshot.val());
      setData(snapshot.val());
    });

    return unsubscribe;
  }, [vehicleId]);

  return data;
}
