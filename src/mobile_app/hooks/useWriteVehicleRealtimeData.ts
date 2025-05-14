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
  const { showToast } = useToast();

  const writeVehicleRealtimeData = useCallback(
    async ({ vehicleId, lat, lon, load }: VehicleRealtimeUpdateInput): Promise<void> => {
      try {
        const updateData: Record<string, any> = {};

        if (lat !== undefined) updateData.lat = lat;
        if (lon !== undefined) updateData.lon = lon;
        if (load !== undefined) updateData.load = load;

        if (Object.keys(updateData).length > 0) {
          await database()
            .ref(`/vehicles/${vehicleId}`)
            .update(updateData);

          showToast(`Write vehicle real-time data successfully: ${JSON.stringify(updateData)}`, 'success');
        } else {
          showToast('No data to update', 'error');
        }
      } catch (error) {
        showToast('Error writing vehicle real-time data', 'error');
      }
    },
    [showToast]
  );

  return { writeVehicleRealtimeData };
};
