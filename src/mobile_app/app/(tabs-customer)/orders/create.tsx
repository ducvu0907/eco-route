import { useCreateOrder } from "@/hooks/useOrder";
import {
  View, Text, TextInput, ActivityIndicator, TouchableOpacity, 
  TouchableWithoutFeedback, Keyboard, Image, ScrollView, Alert
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
import { TrashCategory, OrderCreateRequest } from "@/types/types";
import * as ImagePicker from "expo-image-picker";

// Schema based on OrderCreateRequest interface
const formSchema = z.object({
  latitude: z.number({ required_error: "Location is required" }),
  longitude: z.number({ required_error: "Location is required" }),
  description: z.string().nullable(),
  category: z.nativeEnum(TrashCategory),
  address: z.string().min(1, "Address is required"),
  weight: z.number().min(0.1, "Weight must be at least 0.1 kg").max(1000, "Weight cannot exceed 1000 kg"),
});

type OrderForm = z.infer<typeof formSchema> & { file?: any };

const CATEGORY_INFO = {
  [TrashCategory.GENERAL]: { 
    icon: "trash-outline", 
    color: "bg-gray-100 text-gray-800 border-gray-200",
    description: "Regular household waste"
  },
  [TrashCategory.ORGANIC]: { 
    icon: "leaf-outline", 
    color: "bg-green-100 text-green-800 border-green-200",
    description: "Food scraps, garden waste"
  },
  [TrashCategory.RECYCLABLE]: { 
    icon: "refresh-outline", 
    color: "bg-blue-100 text-blue-800 border-blue-200",
    description: "Paper, plastic, glass, metal"
  },
  [TrashCategory.HAZARDOUS]: { 
    icon: "warning-outline", 
    color: "bg-red-100 text-red-800 border-red-200",
    description: "Chemicals, batteries, paint"
  },
  [TrashCategory.ELECTRONIC]: { 
    icon: "phone-portrait-outline", 
    color: "bg-purple-100 text-purple-800 border-purple-200",
    description: "Computers, phones, appliances"
  },
};

export default function OrderCreate() {
  const { userId } = useAuthContext();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { reverseLocation, data: reverseData, loading: isReversing } = useReverseLocation();

  const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TrashCategory>(TrashCategory.GENERAL);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OrderForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: null,
      category: TrashCategory.GENERAL,
      weight: undefined,
    }
  });

  const watchedWeight = watch("weight");

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

  const onSubmit = (data: OrderForm) => {
    if (!location) {
      Alert.alert("Error", "Please select a location on the map");
      return;
    }

    const orderData: OrderCreateRequest = {
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
      category: data.category,
      address: data.address,
      weight: data.weight,
    };

    createOrder({ payload: orderData, file: data.file }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users", userId, "orders"] });
        Alert.alert("Success", "Order created successfully!", [
          { text: "OK", onPress: () => router.back() }
        ]);
      },
      onError: (error) => {
        Alert.alert("Error", "Failed to create order. Please try again.");
      }
    });
  };

  const handleLocationSelect = (latitude: number, longitude: number) => {
    setLocation({ latitude, longitude });
    setValue("latitude", latitude);
    setValue("longitude", longitude);
    setLocationPickerVisible(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const file = {
        uri: asset.uri,
        name: asset.fileName || 'image.jpg',
        type: asset.mimeType || 'image/jpeg'
      };

      setValue("file", file);
      setImagePreview(asset.uri);
    }
  };

  const removeImage = () => {
    setValue("file", null);
    setImagePreview(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-4">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity 
                onPress={() => router.back()} 
                className="p-2 rounded-full bg-gray-100"
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-gray-800">Create Order</Text>
              <View className="w-10" />
            </View>

            {/* Location Section */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">📍 Location</Text>
              
              <TouchableOpacity 
                className="border-2 border-dashed border-blue-300 p-4 rounded-xl bg-blue-50 mb-3"
                onPress={() => setLocationPickerVisible(true)}
              >
                <View className="items-center">
                  <Ionicons name="location-outline" size={32} color="#3B82F6" />
                  <Text className="text-blue-600 font-medium mt-2">
                    {location ? "Change Location" : "Select Location on Map"}
                  </Text>
                  {location && (
                    <Text className="text-xs text-gray-500 mt-1">
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              <View className="bg-gray-50 p-3 rounded-xl">
                <Text className="text-sm text-gray-600 mb-1">Address</Text>
                {isReversing ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" />
                    <Text className="ml-2 text-gray-500">Getting address...</Text>
                  </View>
                ) : (
                  <Controller
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <Text className="text-gray-800 text-base">
                        {field.value || "No address selected"}
                      </Text>
                    )}
                  />
                )}
              </View>
              {errors.address && (
                <Text className="text-red-500 text-sm mt-1 ml-1">{errors.address.message}</Text>
              )}
            </View>

            {/* Trash Category Section */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">🗂️ Category</Text>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                  <View className="space-y-2">
                    {Object.entries(CATEGORY_INFO).map(([category, info]) => (
                      <TouchableOpacity
                        key={category}
                        className={`p-4 rounded-xl border-2 ${
                          value === category 
                            ? info.color 
                            : "bg-white border-gray-200"
                        }`}
                        onPress={() => {
                          onChange(category);
                          setSelectedCategory(category as TrashCategory);
                        }}
                      >
                        <View className="flex-row items-center">
                          <Ionicons 
                            name={info.icon as any} 
                            size={24} 
                            color={value === category ? 
                              (category === TrashCategory.GENERAL ? "#374151" :
                               category === TrashCategory.ORGANIC ? "#065F46" :
                               category === TrashCategory.RECYCLABLE ? "#1E40AF" :
                               category === TrashCategory.HAZARDOUS ? "#991B1B" : "#581C87") 
                              : "#9CA3AF"
                            } 
                          />
                          <View className="ml-3 flex-1">
                            <Text className={`font-medium ${
                              value === category ? "text-gray-800" : "text-gray-600"
                            }`}>
                              {category.replace('_', ' ')}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">
                              {info.description}
                            </Text>
                          </View>
                          {value === category && (
                            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
              {errors.category && (
                <Text className="text-red-500 text-sm mt-1 ml-1">{errors.category.message}</Text>
              )}
            </View>

            {/* Weight Section */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">⚖️ Weight</Text>
              <Controller
                control={control}
                name="weight"
                render={({ field }) => (
                  <View className="relative">
                    <TextInput
                      className="border-2 border-gray-200 p-4 rounded-xl text-base bg-white"
                      keyboardType="decimal-pad"
                      placeholder="Enter weight"
                      value={field.value ? String(field.value) : ""}
                      onChangeText={(v) => {
                        const numericValue = parseFloat(v);
                        field.onChange(isNaN(numericValue) ? undefined : numericValue);
                      }}
                    />
                    <View className="absolute right-4 top-4">
                      <Text className="text-gray-500 font-medium">kg</Text>
                    </View>
                  </View>
                )}
              />
              {watchedWeight && (
                <Text className="text-sm text-gray-500 mt-1 ml-1">
                  {watchedWeight < 10 ? "Light load" : 
                   watchedWeight < 50 ? "Medium load" : "Heavy load"}
                </Text>
              )}
              {errors.weight && (
                <Text className="text-red-500 text-sm mt-1 ml-1">{errors.weight.message}</Text>
              )}
            </View>

            {/* Description Section */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">📝 Description (Optional)</Text>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TextInput
                    className="border-2 border-gray-200 p-4 rounded-xl text-base bg-white"
                    multiline
                    numberOfLines={4}
                    placeholder="Add any additional details about your waste..."
                    onChangeText={field.onChange}
                    value={field.value || ""}
                    textAlignVertical="top"
                  />
                )}
              />
            </View>

            {/* Image Section */}
            <View className="mb-8">
              <Text className="text-lg font-semibold text-gray-800 mb-3">📷 Photo (Optional)</Text>
              
              {imagePreview ? (
                <View className="relative">
                  <Image 
                    source={{ uri: imagePreview }} 
                    className="w-full h-48 rounded-xl"
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    className="absolute top-2 right-2 bg-red-500 p-2 rounded-full"
                    onPress={removeImage}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  className="border-2 border-dashed border-gray-300 p-8 rounded-xl bg-gray-50"
                  onPress={pickImage}
                >
                  <View className="items-center">
                    <Ionicons name="camera-outline" size={32} color="#9CA3AF" />
                    <Text className="text-gray-500 font-medium mt-2">Add Photo</Text>
                    <Text className="text-gray-400 text-sm mt-1">Tap to select image</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`p-4 rounded-xl ${
                isPending || !location 
                  ? "bg-gray-300" 
                  : "bg-blue-500"
              }`}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending || !location}
            >
              <View className="flex-row items-center justify-center">
                {isPending && <ActivityIndicator size="small" color="white" className="mr-2" />}
                <Text className={`font-semibold text-base ${
                  isPending || !location ? "text-gray-500" : "text-white"
                }`}>
                  {isPending ? "Creating Order..." : "Create Order"}
                </Text>
              </View>
            </TouchableOpacity>

            {!location && (
              <Text className="text-orange-600 text-sm text-center mt-2">
                Please select a location to continue
              </Text>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <DemoLocationPicker
        isVisible={isLocationPickerVisible}
        setLocation={handleLocationSelect}
        onClose={() => setLocationPickerVisible(false)}
      />
    </SafeAreaView>
  );
}