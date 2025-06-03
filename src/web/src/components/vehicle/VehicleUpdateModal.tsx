import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGetDepots } from "@/hooks/useDepot";
import { useGetDriversNotAssigned } from "@/hooks/useUser";
import { useUpdateVehicle } from "@/hooks/useVehicle";
import { VehicleResponse, VehicleStatus } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  Loader2,
  MapPin,
  Save,
  Truck,
  User,
  X
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { z } from "zod";

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
  const queryClient = useQueryClient();
  const { mutate: updateVehicle, isPending } = useUpdateVehicle();
  const { t } = useTranslation(); // Initialize useTranslation

  const { data: depotsData, isLoading: isDepotsLoading, isError: isDepotsError } = useGetDepots();
  const depots = depotsData?.result;

  const { data: driversData, isLoading: isDriversLoading, isError: isDriversError } = useGetDriversNotAssigned();
  const drivers = driversData?.result;

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      depotId: vehicle.depotId || null,
      driverId: vehicle.driver.id || null, 
      status: vehicle.status,
    },
  });

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.ACTIVE:
        return "bg-green-100 text-green-800 border-green-200";
      case VehicleStatus.IDLE:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case VehicleStatus.REPAIR:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.ACTIVE:
        return <CheckCircle className="h-4 w-4" />;
      case VehicleStatus.IDLE:
        return <Clock className="h-4 w-4" />;
      case VehicleStatus.REPAIR:
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const onSubmit = (data: VehicleFormValues) => {
    updateVehicle(
      { vehicleId: vehicle.id, payload: data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["drivers", "not-assigned"] });
          queryClient.invalidateQueries({ queryKey: ["vehicles"] }); // Invalidate general vehicles query
          queryClient.invalidateQueries({ queryKey: ["depots"] }); // Invalidate depots if depotId might change
          onClose();
        },
      }
    );
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      form.reset();
    }
  };

  if (isDepotsLoading || isDriversLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span>{t("vehicleUpdateModal.loading.title")}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-gray-600">{t("vehicleUpdateModal.loading.message")}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isDepotsError || isDriversError) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{t("vehicleUpdateModal.error.title")}</span>
            </DialogTitle>
          </DialogHeader>
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {t("vehicleUpdateModal.error.description")}
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button onClick={() => onClose()} variant="outline">
              {t("vehicleUpdateModal.error.closeButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <span>{t("vehicleUpdateModal.header.title")}</span>
              <div className="text-sm font-normal text-gray-600 mt-1">
                {t("vehicleUpdateModal.header.subtitle", { 
                  licensePlate: vehicle.licensePlate, 
                  vehicleType: vehicle.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) // Format type for display
                })}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Current Vehicle Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Info className="h-4 w-4" />
            <span>{t("vehicleUpdateModal.currentInfoCard.title")}</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">{t("vehicleUpdateModal.currentInfoCard.licensePlate")}</span>
              <p className="font-medium">{vehicle.licensePlate}</p>
            </div>
            <div>
              <span className="text-gray-600">{t("vehicleUpdateModal.currentInfoCard.currentStatus")}</span>
              <Badge className={`ml-2 mt-1 ${getStatusColor(vehicle.status)}`}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(vehicle.status)}
                  <span>{t(`vehicleUpdateModal.vehicleStatus.${vehicle.status}`)}</span>
                </div>
              </Badge>
            </div>
            <div>
              <span className="text-gray-600">{t("vehicleUpdateModal.currentInfoCard.currentDriver")}</span>
              <p className="font-medium">{vehicle.driver.username}</p>
            </div>
            <div>
              <span className="text-gray-600">{t("vehicleUpdateModal.currentInfoCard.capacity")}</span>
              <p className="font-medium">{vehicle.capacity} {t("vehicleUpdateModal.currentInfoCard.unit")}</p>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Depot Field */}
            <FormField
              control={form.control}
              name="depotId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{t("vehicleUpdateModal.formFields.depotAssignment.label")}</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={t("vehicleUpdateModal.formFields.depotAssignment.placeholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {depots?.map((depot) => (
                        <SelectItem key={depot.id} value={depot.id}>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{depot.address}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t("vehicleUpdateModal.formFields.depotAssignment.description")}
                  </FormDescription>
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
                  <FormLabel className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{t("vehicleUpdateModal.formFields.driverAssignment.label")}</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={t("vehicleUpdateModal.formFields.driverAssignment.placeholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Current driver option */}
                      <SelectItem value={vehicle.driver.id}>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-blue-500" />
                          <span>{vehicle.driver.username}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {t("vehicleUpdateModal.formFields.driverAssignment.currentDriverBadge")}
                          </Badge>
                        </div>
                      </SelectItem>
                      {/* Available drivers */}
                      {drivers?.filter(driver => driver.id !== vehicle.driver.id).map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{driver.username}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              {t("vehicleUpdateModal.formFields.driverAssignment.driverPhone", { phone: driver.phone })}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t("vehicleUpdateModal.formFields.driverAssignment.description")}
                  </FormDescription>
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
                  <FormLabel className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{t("vehicleUpdateModal.formFields.vehicleStatus.label")}</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={t("vehicleUpdateModal.formFields.vehicleStatus.placeholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(VehicleStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(status)}
                            <span>{t(`vehicleUpdateModal.vehicleStatus.${status}`)}</span>
                            {status === VehicleStatus.ACTIVE && (
                              <span className="text-xs text-gray-500 ml-2">
                                {t("vehicleUpdateModal.formFields.vehicleStatus.descriptions.ACTIVE")}
                              </span>
                            )}
                            {status === VehicleStatus.IDLE && (
                              <span className="text-xs text-gray-500 ml-2">
                                {t("vehicleUpdateModal.formFields.vehicleStatus.descriptions.IDLE")}
                              </span>
                            )}
                            {status === VehicleStatus.REPAIR && (
                              <span className="text-xs text-gray-500 ml-2">
                                {t("vehicleUpdateModal.formFields.vehicleStatus.descriptions.REPAIR")}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t("vehicleUpdateModal.formFields.vehicleStatus.description")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-6 gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onClose()}
                disabled={isPending}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>{t("vehicleUpdateModal.footer.cancelButton")}</span>
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="flex items-center space-x-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t("vehicleUpdateModal.footer.updatingButton")}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{t("vehicleUpdateModal.footer.updateButton")}</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}