import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetDepots } from "@/hooks/useDepot";
import { useGetUsers } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { DepotResponse, Role, UserResponse, VehicleResponse, VehicleStatus } from "@/types/types";
import { useUpdateVehicle } from "@/hooks/useVehicle";

interface VehicleUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: VehicleResponse;
}

const vehicleSchema = z.object({
  depotId: z.string().nullable(),
  driverId: z.string().nullable(),
  status: z.nativeEnum(VehicleStatus),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export default function VehicleUpdateModal({ isOpen, onClose, vehicle }: VehicleUpdateModalProps) {
  const { mutate: updateVehicle, isPending } = useUpdateVehicle();
  const [depots, setDepots] = useState<DepotResponse[]>([]);
  const [drivers, setDrivers] = useState<UserResponse[]>([]);

  const { data: depotsData } = useGetDepots();
  const { data: usersData } = useGetUsers();

  useEffect(() => {
    if (depotsData?.result) setDepots(depotsData.result);
    if (usersData?.result) setDrivers(usersData.result.filter(u => u.role === Role.DRIVER));
  }, [depotsData, usersData]);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      depotId: vehicle.depotId ?? null,
      driverId: vehicle.driverId ?? null,
      status: vehicle.status,
    },
  });

  const onSubmit = (data: VehicleFormValues) => {
    updateVehicle(
      { vehicleId: vehicle.id, payload: data},
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
    form.reset();
  };

  const onOpenChange = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Vehicle</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Depot Field */}
            <FormField
              control={form.control}
              name="depotId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Depot</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select depot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {depots.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Driver Field */}
            <FormField
              control={form.control}
              name="driverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {drivers.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(VehicleStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Vehicle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
