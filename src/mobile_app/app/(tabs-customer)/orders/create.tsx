import { useCreateOrder } from "@/hooks/useOrder";
import {
  View, Text, TextInput, Button, ActivityIndicator,
  TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useReverseLocation } from "@/hooks/useFetchLocation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import DemoLocationPicker from "@/components/DemoLocationPicker";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/hooks/useAuthContext";
import { TrashCategory } from "@/types/types";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

const formSchema = z.object({
  address: z.string().min(1, "Address is required"),
  weight: z.number().min(1, "Weight is required"),
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().nullable(),
  category: z.nativeEnum(TrashCategory),
  file: z.any()
});

type OrderForm = z.infer<typeof formSchema>;

export default function OrderCreate() {
  const { userId } = useAuthContext();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { reverseLocation, data: reverseData, loading: isReversing } = useReverseLocation();

  const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      reverseLocation(location.latitude, location.longitude);
    }
  }, [location]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OrderForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: null,
      category: TrashCategory.GENERAL
    }
  });

  useEffect(() => {
    if (reverseData?.display_name) {
      setValue("address", reverseData.display_name);
    }
  }, [reverseData]);

  const onSubmit = (data: OrderForm) => {
    createOrder({ payload: data, file: data.file }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users", userId, "orders"] });
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const file = {
        uri: asset.uri,
        name: asset.fileName,
        type: asset.mimeType
      };

      setValue("file", file);
      setImagePreview(asset.uri);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="p-4">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold mb-4 text-center">Create Order</Text>

          {/* Address */}
          {/* <View className="mb-4">
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
                    onChangeText={field.onChange}
                  />
                )}
              />
            )}
            {errors.address && <Text className="text-red-500 text-sm">{errors.address.message}</Text>}
          </View> */}

          <View className="mb-4">
            <Text className="text-gray-700">Address</Text>
            <View className="border p-2 rounded bg-gray-100 min-h-[40px] justify-center">
              {isReversing ? (
                <ActivityIndicator size="small" />
              ) : (
                <Controller
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <Text className="text-gray-800">{field.value || "No address selected"}</Text>
                  )}
                />
              )}
            </View>
            {errors.address && <Text className="text-red-500 text-sm">{errors.address.message}</Text>}
          </View>

          {/* Latitude */}
          {/* <View className="mb-4">
            <Text className="text-gray-700">Latitude</Text>
            <Controller
              control={control}
              name="latitude"
              render={({ field }) => (
                <TextInput
                  {...field}
                  className="border p-2 rounded"
                  keyboardType="numeric"
                  value={field.value ? String(field.value) : ""}
                  onChangeText={(v) => field.onChange(parseFloat(v))}
                />
              )}
            />
            {errors.latitude && <Text className="text-red-500 text-sm">{errors.latitude.message}</Text>}
          </View> */}

          {/* Longitude */}
          {/* <View className="mb-4">
            <Text className="text-gray-700">Longitude</Text>
            <Controller
              control={control}
              name="longitude"
              render={({ field }) => (
                <TextInput
                  {...field}
                  className="border p-2 rounded"
                  keyboardType="numeric"
                  value={field.value ? String(field.value) : ""}
                  onChangeText={(v) => field.onChange(parseFloat(v))}
                />
              )}
            />
            {errors.longitude && <Text className="text-red-500 text-sm">{errors.longitude.message}</Text>}
          </View> */}

          {/* Pick Location */}
          <TouchableOpacity className="mb-4 bg-blue-500 p-3 rounded" onPress={() => setLocationPickerVisible(true)}>
            <Text className="text-white text-center">Pick Location on Map</Text>
          </TouchableOpacity>

          {/* Weight */}
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
                  onChangeText={(v) => field.onChange(parseFloat(v))}
                />
              )}
            />
            {errors.weight && <Text className="text-red-500 text-sm">{errors.weight.message}</Text>}
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-gray-700">Description (optional)</Text>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextInput
                  {...field}
                  className="border p-2 rounded"
                  multiline
                  numberOfLines={3}
                  placeholder="Add a description"
                  onChangeText={field.onChange}
                  value={field.value || ""}
                />
              )}
            />
            {errors.description && <Text className="text-red-500 text-sm">{errors.description.message}</Text>}
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">Category</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { onChange, value } }) => (
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                  style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 16 }}
                >
                  {Object.values(TrashCategory).map(category => (
                    <Picker.Item key={category} label={category} value={category} />
                  ))}
                </Picker>
              )}
            />
            {errors.category && <Text className="text-red-500 text-sm">{errors.category.message}</Text>}
          </View>

          {/* Image Picker */}
          <View className="mb-4">
            <Text className="text-gray-700">Image</Text>
            <Button title="Pick Image" onPress={pickImage} />
            {imagePreview && (
              // <Image source={{ uri: imagePreview }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 8 }} />
              <Text>{imagePreview}</Text>
            )}
            {errors.file && <Text className="text-red-500 text-sm">error</Text>}
          </View>

          {/* Submit */}
          <Button title={isPending ? "Creating..." : "Create Order"} onPress={handleSubmit(onSubmit)} disabled={isPending} />
          {isPending && <ActivityIndicator size="large" className="mt-4" />}

        </View>
      </TouchableWithoutFeedback>

      <DemoLocationPicker
        isVisible={isLocationPickerVisible}
        setLocation={handleLocationSelect}
        onClose={() => setLocationPickerVisible(false)}
      />
    </SafeAreaView>
  );
}
