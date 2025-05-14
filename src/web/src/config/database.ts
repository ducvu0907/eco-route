import { database } from "@/firebase";
import { VehicleRealtimeData } from "@/types/types";
import { ref, update } from "firebase/database";

export const writeVehicleData = async (vehicleId: string, latitude: number, longitude: number, load: number) => {
  try {
    const dbRef = ref(database, `/vehicles/${vehicleId}`);

    const data: VehicleRealtimeData = {
      latitude,
      longitude,
      load
    };

    await update(dbRef, data);
    console.log("Vehicle data written");

  } catch (error) {
    console.error(`Failed to write vehicle to ${vehicleId}: `, error);
    throw error;
  }
}
