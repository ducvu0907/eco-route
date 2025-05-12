import { useCreateDepot, useUpdateDepot } from "@/hooks/useDepot";
import { useReverseLocation, useSearchLocation } from "@/hooks/useFetchLocation";
import { DepotCreateRequest, DepotResponse, DepotUpdateRequest, OsmResponse } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  FormMessage
} from "@/components/ui/form";
import MapModalInput from "@/components/map/MapModalInput";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin } from "lucide-react";
import SearchDropdown from "@/components/depot/SearchDropdown";

const formSchema = z.object({
  address: z.string(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

type FormValues = z.infer<typeof formSchema>;

interface DepotCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  depot: DepotResponse;
}

export default function DepotUpdatemodal({ isOpen, onClose, depot }: DepotCreateModalProps) {
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
    },
  });

  const { reverseLocation, data: reverseData, loading: isReversing } = useReverseLocation();
  const { searchLocation, data: searchData } = useSearchLocation();

  const lat = form.watch("latitude");
  const lon = form.watch("longitude");

  useEffect(() => {
    if (lat && lon) reverseLocation(lat, lon);
  }, [lat, lon]);

  useEffect(() => {
    if (reverseData?.display_name) {
      form.setValue("address", reverseData.display_name);
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

  const handleSelectItem = (item: OsmResponse) => {
    form.setValue("latitude", parseFloat(item.lat ?? "0"));
    form.setValue("longitude", parseFloat(item.lon ?? "0"));
    form.setValue("address", item.display_name ?? "");
    setShowDropdown(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:max-w-5xl h-1/2">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Update Depot
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Search Location</h3>
                  <p className="text-sm text-slate-500">Search or pick from map</p>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search address..."
                    value={searchQuery || ""}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                  <MapModalInput setLatLng={setLatLng} />
                </div>
                {searchData && searchData.length > 0 && showDropdown && (
                  <div className="relative">
                    <div className="absolute z-10 w-full bg-white border border-slate-200 mt-1 rounded shadow">
                      <SearchDropdown
                        isOpen={showDropdown}
                        results={searchData}
                        onSelect={handleSelectItem}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Location Details</h3>
                  <p className="text-sm text-slate-500">Coordinates and address</p>
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <>
                      {isReversing ? <Loader2 /> : (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} className="w-full" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    </>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" {...field} readOnly className="bg-slate-50" />
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
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" {...field} readOnly className="bg-slate-50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || isReversing}>
                {isPending || isReversing ?
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> :
                  "Update Depot"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
