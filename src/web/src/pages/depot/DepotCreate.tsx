import { useCreateDepot } from "@/hooks/useDepot";
import { useReverseLocation, useSearchLocation } from "@/hooks/useFetchLocation";
import { DepotCreateRequest, OsmResponse } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";
import SearchDropdown from "@/components/depot/SearchDropdown";

const formSchema = z.object({
  address: z.string(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

type FormValues = z.infer<typeof formSchema>;

export default function DepotCreate() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState<string | null>(null);
  const navigate = useNavigate();
  const { mutate: createDepot, isPending } = useCreateDepot();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const { reverseLocation, data: reverseData, loading: isReversing } = useReverseLocation();
  const { searchLocation, data: searchData, loading: isSearching } = useSearchLocation();

  const lat = form.watch("latitude");
  const lon = form.watch("longitude");

  // reverse geocode when lat/lon change
  useEffect(() => {
    if (lat && lon) reverseLocation(lat, lon);
  }, [lat, lon]);

  // set address if reverse geocode result found
  useEffect(() => {
    if (reverseData?.display_name) {
      form.setValue("address", reverseData.display_name);
    }
  }, [reverseData]);

  // search matching addresses
  useEffect(() => {
    if (debouncedQuery) {
      searchLocation(debouncedQuery);
    }
  }, [debouncedQuery]);

  // debounce search query
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

  const onSubmit = (data: DepotCreateRequest) => {
    createDepot(data);
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
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Create New Depot
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Location Search */}
                <div className="space-y-4">
                  <div className="mb-2">
                    <h3 className="text-sm font-medium mb-1">Search Location</h3>
                    <p className="text-sm text-slate-500">Search for an address or use the map to set location</p>
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

                  {/* Search Results Dropdown */}
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
                {/* Right Column - Coordinates & Address Display */}
                <div className="space-y-4">
                  <div className="mb-2">
                    <h3 className="text-sm font-medium mb-1">Location Details</h3>
                    <p className="text-sm text-slate-500">
                      Coordinates and address information
                    </p>
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <>
                          {isReversing ? <Loader2 /> : (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Select address"
                                  {...field}
                                  value={field.value}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        </>
                      )}
                    />

                  </div>
                  {/* Coordinate Fields */}
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

              <div className="flex justify-end border-t pt-4 mt-6">
                <Button type="button" variant="outline" className="mr-2" onClick={() => navigate("/depots")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending || isReversing} onClick={() => navigate("/depots")}>
                  {isPending || isReversing ?
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> :
                    "Create Depot"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}