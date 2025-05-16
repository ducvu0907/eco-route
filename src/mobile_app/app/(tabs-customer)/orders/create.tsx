import { useCreateOrder } from "@/hooks/useOrder";
import { View, Text, TextInput, Button, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useReverseLocation, useSearchLocation } from "@/hooks/useFetchLocation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import LocationPicker from "@/components/LocationPicker";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/hooks/useAuthContext";
import DemoLocationPicker from "@/components/DemoLocationPicker";

const formSchema = z.object({
  address: z.string().min(1, "Address is required"),
  weight: z.number().min(1, "Weight must be at least 1 kg"),
  latitude: z.number(),
  longitude: z.number(),
});

type OrderForm = z.infer<typeof formSchema>;

export default function OrderCreate() {
  const {userId} = useAuthContext();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { reverseLocation, data: reverseData, loading: isReversing } = useReverseLocation();

  const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (location) {
      reverseLocation(location.latitude, location.longitude);
    }
  }, [location]);

  useEffect(() => {
    if (reverseData?.display_name) {
      setValue("address", reverseData.display_name);
    }
  }, [reverseData]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<OrderForm>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: OrderForm) => {
    createOrder(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["users", userId, "orders"]})
        router.back();
      },
    });
  };

  const handleLocationSelect = (latitude: number, longitude: number) => {
    setLocation({ latitude, longitude });
    setValue("latitude", latitude);
    setValue("longitude", longitude);
    setLocationPickerVisible(false);
  };

  return (
    <SafeAreaView className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="p-4">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold mb-4 text-center">Create Order</Text>

          <View className="mb-4">
            <Text className="text-gray-700">Address</Text>
            {isReversing ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <TextInput
                    {...field}
                    className="border p-2 rounded"
                    placeholder="Enter address"
                    value={field.value}
                    onChangeText={(value) => field.onChange(value)}
                  />
                )}
              />
            )}
            {errors.address && (
              <Text className="text-red-500 text-sm">{errors.address.message}</Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-gray-700">Latitude</Text>
            <Controller
              control={control}
              name="latitude"
              render={({ field }) => (
                <TextInput
                  {...field}
                  className="border p-2 rounded"
                  keyboardType="numeric"
                  placeholder="Enter latitude"
                  value={field.value ? String(field.value) : ""}
                  onChangeText={(value) => field.onChange(parseFloat(value))}
                />
              )}
            />
            {errors.latitude && (
              <Text className="text-red-500 text-sm">{errors.latitude.message}</Text>
            )}
          </View>

          <View className="mb-4">
            <Text className="text-gray-700">Longitude</Text>
            <Controller
              control={control}
              name="longitude"
              render={({ field }) => (
                <TextInput
                  {...field}
                  className="border p-2 rounded"
                  keyboardType="numeric"
                  placeholder="Enter longitude"
                  value={field.value ? String(field.value) : ""}
                  onChangeText={(value) => field.onChange(parseFloat(value))}
                />
              )}
            />
            {errors.longitude && (
              <Text className="text-red-500 text-sm">{errors.longitude.message}</Text>
            )}
          </View>

          {/* Button to open the location picker modal */}
          <TouchableOpacity
            className="mb-4 bg-blue-500 p-3 rounded"
            onPress={() => setLocationPickerVisible(true)}
          >
            <Text className="text-white text-center">Pick Location on Map</Text>
          </TouchableOpacity>

          <View className="mb-4">
            <Text className="text-gray-700">Weight (kg)</Text>
            <Controller
              control={control}
              name="weight"
              render={({ field }) => (
                <TextInput
                  {...field}
                  className="border p-2 rounded"
                  keyboardType="numeric"
                  placeholder="Enter weight"
                  value={field.value ? String(field.value) : ""}
                  onChangeText={(value) => field.onChange(parseFloat(value))}
                />
              )}
            />
            {errors.weight && (
              <Text className="text-red-500 text-sm">{errors.weight.message}</Text>
            )}
          </View>

          <Button
            title={isPending ? "Creating..." : "Create Order"}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          />

          {isPending && (
            <ActivityIndicator size="large" className="mt-4" />
          )}
        </View>
      </TouchableWithoutFeedback>

      <DemoLocationPicker
        isVisible={isLocationPickerVisible}
        setLocation={handleLocationSelect}
        onClose={() => setLocationPickerVisible(false)}
      />

      {/* 
      <LocationPicker
        isVisible={isLocationPickerVisible}
        setLocation={handleLocationSelect}
        onClose={() => setLocationPickerVisible(false)}
      /> */}

    </SafeAreaView>
  );
}
