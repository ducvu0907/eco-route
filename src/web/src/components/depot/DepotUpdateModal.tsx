import SearchDropdown from "@/components/depot/SearchDropdown";
import MapModalInput from "@/components/map/MapModalInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateDepot } from "@/hooks/useDepot";
import { useReverseLocation, useSearchLocation } from "@/hooks/useFetchLocation";
import { DepotResponse, DepotUpdateRequest, Feature, TrashCategory } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader, Loader2, MapPin, Navigation, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const formSchema = z.object({
  address: z.string(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  category: z.nativeEnum(TrashCategory)
});

type FormValues = z.infer<typeof formSchema>;

interface DepotUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  depot: DepotResponse;
}

export default function DepotUpdateModal({ isOpen, onClose, depot }: DepotUpdateModalProps) {
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState<string | null>(null);
  const { mutate: updateDepot, isPending } = useUpdateDepot();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: depot.address,
      latitude: depot.latitude,
      longitude: depot.longitude,
      category: depot.category
    },
  });

  const { reverseLocation, data: reverseData, loading: isReversing } = useReverseLocation();
  const { searchLocation, data: searchData, loading: isSearching } = useSearchLocation();

  const lat = form.watch("latitude");
  const lon = form.watch("longitude");
  const address = form.watch("address");

  useEffect(() => {
    if (lat && lon) reverseLocation(lat, lon);
  }, [lat, lon]);

  useEffect(() => {
    if (reverseData) {
      form.setValue("address", reverseData);
    }
  }, [reverseData]);

  useEffect(() => {
    if (debouncedQuery) {
      searchLocation(debouncedQuery);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery && searchQuery.trim().length > 3) {
        setDebouncedQuery(searchQuery.trim());
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (searchData) {
      setShowDropdown(true);
    }
  }, [searchData]);

  const onSubmit = (data: DepotUpdateRequest) => {
    updateDepot({ depotId: depot.id, payload: data }, {
      onSuccess: () => {
        onClose();
      },
    });
    form.reset();
  };

  const setLatLng = (lat: number, lng: number) => {
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
  };

  const handleSelectItem = (item: Feature) => {
    form.setValue("latitude", item.geometry.coordinates[1]);
    form.setValue("longitude", item.geometry.coordinates[0]);
    form.setValue("address", item.properties.label || "");
    setShowDropdown(false);
  };

  const hasLocation = lat !== 0 && lon !== 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            {t("depotUpdateModal.title")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-dashed border-slate-200 hover:border-slate-300 transition-colors">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Search className="h-4 w-4 text-slate-600" />
                    {t("depotUpdateModal.findLocationCard.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        {isSearching ? (
                          <Loader className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        ) : (
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        )}
                        <Input
                          placeholder={t("depotUpdateModal.findLocationCard.searchPlaceholder")}
                          value={searchQuery || ""}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <MapModalInput setLatLng={setLatLng} />
                    </div>
                    {searchData && searchData.length > 0 && showDropdown && (
                      <div className="absolute z-50 w-full mt-2">
                        <div className="bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                          <SearchDropdown
                            isOpen={showDropdown}
                            results={searchData}
                            onSelect={handleSelectItem}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {!hasLocation && (
                    <div className="text-center py-8 text-slate-500">
                      <MapPin className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                      <p className="text-sm">
                        {t("depotUpdateModal.findLocationCard.mapPickerPlaceholder")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className={`transition-all duration-200 ${hasLocation ? 'border-green-200 bg-green-50/30' : 'border-slate-200'}`}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Navigation className="h-4 w-4 text-slate-600" />
                    {t("depotUpdateModal.locationDetailsCard.title")}
                    {hasLocation && (
                      <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 border-green-200">
                        <MapPin className="h-3 w-3 mr-1" />
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-slate-700">
                          {t("depotUpdateModal.locationDetailsCard.addressLabel")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            {isReversing ? (
                              <div className="flex items-center justify-center h-11 border border-slate-300 rounded-md bg-slate-50">
                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                <span className="ml-2 text-sm text-slate-500">
                                  {t("depotUpdateModal.locationDetailsCard.locatingText")}
                                </span>
                              </div>
                            ) : (
                              <Input
                                {...field}
                                className={`h-11 ${address ? 'bg-white border-green-300' : 'bg-slate-50 border-slate-300'}`}
                                placeholder={t("depotUpdateModal.locationDetailsCard.addressPlaceholder")}
                                readOnly={hasLocation}
                              />
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700">
                            {t("depotUpdateModal.locationDetailsCard.latitudeLabel")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              {...field}
                              readOnly
                              className="h-11 bg-slate-50 border-slate-300 text-slate-600 font-mono text-sm"
                              placeholder="0.000000"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700">
                            {t("depotUpdateModal.locationDetailsCard.longitudeLabel")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="any"
                              {...field}
                              readOnly
                              className="h-11 bg-slate-50 border-slate-300 text-slate-600 font-mono text-sm"
                              placeholder="0.000000"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-slate-700">
                            {t("depotUpdateModal.locationDetailsCard.categoryLabel")}
                          </FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="h-11 w-full border border-slate-300 rounded-md px-3 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {Object.values(TrashCategory).map((category) => (
                                <option key={category} value={category}>
                                  {t(`depotUpdateModal.trashCategories.${category}`)}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="pt-6 border-t border-slate-200 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-11 px-6"
              >
                {t("depotUpdateModal.footer.cancelButton")}
              </Button>
              <Button
                type="submit"
                disabled={isPending || isReversing || !hasLocation}
                className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isPending || isReversing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("depotUpdateModal.footer.updatingButton")}
                  </>
                ) : (
                  <>
                    <Building2 className="mr-2 h-4 w-4" />
                    {t("depotUpdateModal.footer.updateButton")}
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