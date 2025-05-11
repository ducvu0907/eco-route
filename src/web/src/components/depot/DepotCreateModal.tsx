import { useCreateDepot } from "@/hooks/useDepot";
import { useReverseLocation, useSearchLocation } from "@/hooks/useFetchLocation";
import { DepotCreateRequest, OsmResponse } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  FormField, FormItem, FormLabel, FormControl, FormMessage, Form
} from "../ui/form";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "@radix-ui/react-dialog";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import MapModalInput from "../map/MapModalInput";

const formSchema = z.object({
  address: z.string().nullable(),
  latitude: z.number(),
  longitude: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

interface DepotCreateModalProps {}

export default function DepotCreateModal({}: DepotCreateModalProps) {
  const { mutate: createDepot, isPending } = useCreateDepot();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);

  const { reverseLocation, data: reverseData } = useReverseLocation();
  const { searchLocation, data: searchResults } = useSearchLocation();

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

  // debounce or watch query change
  useEffect(() => {
    if (searchQuery.trim().length >= 3) {
      searchLocation(searchQuery);
    }
  }, [searchQuery]);

  const onSubmit = (data: DepotCreateRequest) => {
    createDepot(data);
  };

  const handleSelectLocation = (item: OsmResponse) => {
    form.setValue("latitude", parseFloat(item.lat ?? "0"));
    form.setValue("longitude", parseFloat(item.lon ?? "0"));
    form.setValue("address", item.display_name ?? null);
    setOpenDropdown(false);
  };

  const setLatLng = (lat: number, lng: number) => {
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"}>Create New Depot</Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Depot</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                {/* 🔍 Address Search Dropdown */}
                <Popover open={openDropdown} onOpenChange={setOpenDropdown}>
                  <PopoverTrigger asChild>
                    <Input
                      placeholder="Search address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[400px]">
                    <Command>
                      <CommandInput placeholder="Search locations..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {searchResults?.map((item, idx) => (
                            <CommandItem
                              key={idx}
                              value={item.display_name ?? "N/A"}
                              onSelect={() => handleSelectLocation(item)}
                            >
                              {item.display_name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* 📍 Lat / Lng Inputs */}
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} disabled />
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
                        <Input type="number" step="any" {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <MapModalInput setLatLng={setLatLng}/>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Create Depot"}
              </Button>
            </DialogFooter>
          </form>
        </Form>

        <DialogClose className="absolute top-4 right-4 text-lg font-bold text-gray-600 hover:text-gray-800 cursor-pointer">×</DialogClose>

      </DialogContent>
    </Dialog>
  );
}
