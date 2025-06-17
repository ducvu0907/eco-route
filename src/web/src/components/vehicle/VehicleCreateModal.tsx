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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { 
  Truck, 
  MapPin, 
  User, 
  Hash, 
  Loader2,
} from "lucide-react";
import { useGetDepots } from "@/hooks/useDepot";
import { useGetDriversNotAssigned } from "@/hooks/useUser";
import { DepotResponse, Role, UserResponse, VehicleType } from "@/types/types";
import { useCreateVehicle } from "@/hooks/useVehicle";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface VehicleCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  depot?: DepotResponse;
  driver?: UserResponse;
}

export default function VehicleCreateModal({ isOpen, onClose, depot, driver }: VehicleCreateModalProps) {
  const queryClient = useQueryClient();
  const { mutate: createVehicle, isPending } = useCreateVehicle();
  const { t } = useTranslation(); // Initialize useTranslation

  const vehicleSchema = z.object({
    depotId: z.string().min(1, t("vehicleCreateModal.formFields.depotLocation.required")),
    driverId: z.string().min(1, t("vehicleCreateModal.formFields.driverAssignment.required")),
    licensePlate: z.string().min(1, t("vehicleCreateModal.formFields.licensePlate.required")),
    type: z.nativeEnum(VehicleType)
  });

  type VehicleFormValues = z.infer<typeof vehicleSchema>;

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
      type: VehicleType.THREE_WHEELER
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

  const formatVehicleType = (type: VehicleType) => {
    return t(`vehicleCreateModal.vehicleTypes.${type}`);
  };

  // const formatCategory = (category: TrashCategory) => {
  //   return t(`vehicleCreateModal.trashCategories.${category}`);
  // };

  // const getCategoryIcon = (category: TrashCategory) => {
  //   switch (category) {
  //     case TrashCategory.GENERAL:
  //       return '🗑️';
  //     case TrashCategory.ORGANIC:
  //       return '🌱';
  //     case TrashCategory.RECYCLABLE:
  //       return '♻️';
  //     case TrashCategory.HAZARDOUS:
  //       return '⚠️';
  //     case TrashCategory.ELECTRONIC:
  //       return '📱';
  //     default:
  //       return '📦';
  //   }
  // };

  const getVehicleTypeIcon = (type: VehicleType) => {
    switch (type) {
      case VehicleType.THREE_WHEELER:
        return '🛺';
      case VehicleType.COMPACTOR_TRUCK:
        return '🚛';
      default:
        return '🚚';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-white">
        {/* Header */}
        <DialogHeader className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {t("vehicleCreateModal.header.title")}
                </DialogTitle>
                <p className="text-gray-600 mt-1">
                  {t("vehicleCreateModal.header.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Form Content */}
        <div className="px-8 py-6">
          <Form {...form}>
            <div className="space-y-6">
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Depot Field */}
                {!depot && (
                  <FormField
                    control={form.control}
                    name="depotId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {t("vehicleCreateModal.formFields.depotLocation.label")}
                        </FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-11 border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors">
                              <SelectValue placeholder={t("vehicleCreateModal.formFields.depotLocation.placeholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {depots.map((d) => (
                              <SelectItem key={d.id} value={d.id} className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  {d.address}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                )}

                {/* Driver Field */}
                {driver ? (
                  <div className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      {t("vehicleCreateModal.formFields.driverAssignment.label")}
                    </FormLabel>
                    <div className="h-11 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 font-medium">{driver.username}</span>
                      <span className="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                        {t("vehicleCreateModal.formFields.driverAssignment.preselected")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="driverId"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          {t("vehicleCreateModal.formFields.driverAssignment.label")}
                        </FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-11 border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors">
                              <SelectValue placeholder={t("vehicleCreateModal.formFields.driverAssignment.placeholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {drivers.filter(d => d.role === Role.DRIVER).map((d) => (
                              <SelectItem key={d.id} value={d.id} className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  {d.username}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* License Plate */}
              <FormField
                control={form.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      {t("vehicleCreateModal.formFields.licensePlate.label")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                          placeholder={t("vehicleCreateModal.formFields.licensePlate.placeholder")} 
                          className="pl-10 h-11 border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors uppercase"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                {/* Vehicle Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-500" />
                        {t("vehicleCreateModal.formFields.vehicleType.label")}
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-11 border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors">
                            <SelectValue placeholder={t("vehicleCreateModal.formFields.vehicleType.placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(VehicleType).map((type) => (
                            <SelectItem key={type} value={type} className="cursor-pointer">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getVehicleTypeIcon(type)}</span>
                                {formatVehicleType(type)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                {/* Trash Category */}
                {/* <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Trash className="w-4 h-4 text-gray-500" />
                        {t("vehicleCreateModal.formFields.wasteCategory.label")}
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="h-11 border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors">
                            <SelectValue placeholder={t("vehicleCreateModal.formFields.wasteCategory.placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(TrashCategory).map((category) => (
                            <SelectItem key={category} value={category} className="cursor-pointer">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getCategoryIcon(category)}</span>
                                {formatCategory(category)}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                /> */}
              </div>

            </div>
          </Form>
        </div>

        {/* Footer */}
        <DialogFooter className="px-8 py-6 bg-gray-50 border-t border-gray-100">
          <div className="flex gap-3 w-full justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="px-6 hover:bg-gray-100"
            >
              {t("vehicleCreateModal.footer.cancelButton")}
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              onClick={form.handleSubmit(onSubmit)}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("vehicleCreateModal.footer.creatingButton")}
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 mr-2" />
                  {t("vehicleCreateModal.footer.createButton")}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}