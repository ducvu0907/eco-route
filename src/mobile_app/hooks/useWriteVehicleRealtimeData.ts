import { useToast } from '@/hooks/useToast';
import database from '@react-native-firebase/database';
import { useCallback } from 'react';

interface VehicleRealtimeUpdateInput {
  vehicleId: string;
  lat?: number;
  lon?: number;
  load?: number;
}

export const useWriteVehicleRealtimeData = () => {
  const writeVehicleRealtimeData = useCallback(
    async ({ vehicleId, lat, lon, load }: VehicleRealtimeUpdateInput): Promise<void> => {
      try {
        const updateData: Record<string, any> = {};

        if (lat !== undefined) updateData.latitude = lat;
        if (lon !== undefined) updateData.longitude = lon;
        if (load !== undefined) updateData.load = load;

        await database()
          .ref(`/vehicles/${vehicleId}`)
          .update(updateData);

        console.log(`Write vehicle data successfully: ${vehicleId}`);

      } catch (error) {
        console.log("Firebase error: ", error);
      }
    },
    []
  );

  return { writeVehicleRealtimeData };
};
