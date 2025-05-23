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
import { useGetDriversNotAssigned } from "@/hooks/useUser";
import { DepotResponse, Role, TrashCategory, UserResponse, VehicleType } from "@/types/types";
import { useCreateVehicle } from "@/hooks/useVehicle";
import { useQueryClient } from "@tanstack/react-query";

interface VehicleCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  depot?: DepotResponse;
  driver?: UserResponse;
}

const vehicleSchema = z.object({
  depotId: z.string().min(1, "Depot is required"),
  driverId: z.string().min(1, "Driver is required"),
  licensePlate: z.string().min(1, "License plate is required"),
  // capacity: z.coerce.number().positive("Capacity must be positive"),
  type: z.nativeEnum(VehicleType),
  category: z.nativeEnum(TrashCategory)
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export default function VehicleCreateModal({ isOpen, onClose, depot, driver }: VehicleCreateModalProps) {
  const queryClient = useQueryClient();
  const { mutate: createVehicle, isPending } = useCreateVehicle();

  const { data: depotsData } = useGetDepots();
  const depots = depotsData?.result || [];

  const { data: driversData } = useGetDriversNotAssigned();
  const drivers = driversData?.result || [];

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      depotId: depot?.id || "",
      driverId: driver?.id || "",
      licensePlate: "",
      // capacity: 0,
      type: VehicleType.THREE_WHEELER,
      category: TrashCategory.GENERAL
    },
  });

  const onSubmit = (data: VehicleFormValues) => {
    createVehicle(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["depots", data.depotId]})
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
            {!depot && (
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
                    <Input placeholder="Vehicle license plate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacity */}
            {/* <FormField
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
            /> */}

            {/* Vehicle Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(VehicleType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Trash Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trash Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trash category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TrashCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
                {isPending ? "Creating..." : "Create Vehicle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
