import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
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
import { Input } from "@/components/ui/input";
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
import { DepotResponse, Role, UserResponse } from "@/types/types";
import { useCreateVehicle } from "@/hooks/useVehicle";
import { DialogClose } from "@radix-ui/react-dialog";
import { W } from "node_modules/react-router/dist/development/fog-of-war-D2zsXvum.d.mts";

interface VehicleCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  depot?: DepotResponse;
  driver?: UserResponse;
}

const vehicleSchema = z.object({
  depotId: z.string().nullable(),
  driverId: z.string().nullable(),
  licensePlate: z.string().min(1, "License plate is required"),
  capacity: z.coerce.number().positive("Capacity must be positive"),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export default function VehicleCreateModal({ isOpen, onClose, depot, driver }: VehicleCreateModalProps) {
  const { mutate: createVehicle, isPending } = useCreateVehicle();
  const [depots, setDepots] = useState<DepotResponse[]>([]);
  const [drivers, setDrivers] = useState<UserResponse[]>([]);

  const { data: depotsData } = useGetDepots();
  const { data: usersData } = useGetUsers();

  useEffect(() => {
    if (!depot && depotsData?.result) setDepots(depotsData.result);
    if (!driver && usersData?.result) setDrivers(usersData.result);
  }, [depotsData, usersData, depot, driver]);

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      depotId: depot?.id || null,
      driverId: driver?.id || null,
      licensePlate: "",
      capacity: 0,
    },
  });

  const onSubmit = (data: VehicleFormValues) => {
    createVehicle(data, {
      onSuccess: () => {
        onClose();
      },
    });
    form.reset();
  };

  const onOpenChange = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Vehicle</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Depot Field */}
            {depot ? (
              <div>
                <FormLabel>Depot</FormLabel>
                <Input value={depot.id} disabled />
                <p className="text-sm text-muted-foreground">{depot.address}</p>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="depotId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depot</FormLabel>
                    <Select onValueChange={field.onChange}>
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
            )}

            {/* Driver Field */}
            {driver ? (
              <div>
                <FormLabel>Driver</FormLabel>
                <Input value={driver.username} disabled />
              </div>
            ) : (
              <FormField
                control={form.control}
                name="driverId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Driver</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {drivers.filter(d => d.role === Role.DRIVER).map((d) => (
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
            )}

            {/* License Plate */}
            <FormField
              control={form.control}
              name="licensePlate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Plate</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacity */}
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Vehicle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
