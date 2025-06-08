import DemoLocationPicker from "@/components/DemoLocationPicker";
import { useGetOrderById, useUpdateOrder } from "@/hooks/useOrder"; 
import {
  View, Text, TextInput, ActivityIndicator, TouchableOpacity,
  TouchableWithoutFeedback, Keyboard, Image, ScrollView, Alert
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useReverseLocation } from "@/hooks/useFetchLocation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/hooks/useAuthContext";
import { TrashCategory, OrderUpdateRequest } from "@/types/types"; 
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/useToast";

const formSchema = z.object({
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  category: z.nativeEnum(TrashCategory, { errorMap: () => ({ message: "orderUpdate.categoryInvalid" }) }).nullable().optional(),
  address: z.string().min(1, "orderUpdate.addressRequired").nullable().optional(), // Still require if present, but field is optional
  weight: z.coerce.number({invalid_type_error: "orderUpdate.weightInvalid"}).min(0.1, "orderUpdate.weightMin").nullable().optional(),
  file: z.any().optional(),
});

type OrderForm = z.infer<typeof formSchema>;

export default function OrderUpdate() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { userId } = useAuthContext();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder();
  const { reverseLocation, data: reverseData, loading: isReversing } = useReverseLocation();

  const { data: orderDetails, isLoading: isLoadingOrder } = useGetOrderById(orderId as string);
  const order = orderDetails?.result;
  console.log(order?.imageUrl);

  const [isLocationPickerVisible, setLocationPickerVisible] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TrashCategory | undefined>(undefined);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<OrderForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: undefined,
      category: undefined,
      weight: undefined,
      latitude: undefined,
      longitude: undefined,
      address: undefined,
      file: undefined,
    }
  });

  useEffect(() => {
    if (order) {
      reset({
        latitude: order.latitude,
        longitude: order.longitude,
        description: order.description,
        category: order.category,
        address: order.address,
        weight: order.weight,
      });
      setLocation({ latitude: order.latitude, longitude: order.longitude });
      setSelectedCategory(order.category);
      if (order.imageUrl) {
        setImagePreview(order.imageUrl);
      }
    }
  }, [orderDetails, reset]);

  useEffect(() => {
    if (location) {
      reverseLocation(location.latitude, location.longitude);
    }
  }, [location]);

  useEffect(() => {
    if (reverseData) {
      setValue("address", reverseData);
    }
  }, [reverseData]);

  const onSubmit = (data: OrderForm) => {
    // only send fields that have been changed
    const payload: OrderUpdateRequest = {};

    if (data.latitude !== undefined) payload.latitude = data.latitude;
    if (data.longitude !== undefined) payload.longitude = data.longitude;
    if (data.description !== undefined) payload.description = data.description;
    if (data.category !== undefined) payload.category = data.category;
    if (data.address !== undefined) payload.address = data.address;
    if (data.weight !== undefined) payload.weight = data.weight;

    // handle image changes
    let fileToUpload: any = undefined;
    if (data.file && data.file !== order?.imageUrl) {
      console.log("image changed");
      fileToUpload = data.file;
    }


    updateOrder({ orderId: orderId as string, payload, file: fileToUpload }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast(t("orderUpdate.cameraPermissionDenied"), "error");
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
    setValue("file", null); // Set file to null to indicate removal
    setImagePreview(null);
  };

  const CATEGORY_INFO = {
    [TrashCategory.GENERAL]: {
      icon: "trash-outline",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      description: t("orderCreate.categoryGeneralDescription")
    },
    [TrashCategory.ORGANIC]: {
      icon: "leaf-outline",
      color: "bg-green-100 text-green-800 border-green-200",
      description: t("orderCreate.categoryOrganicDescription")
    },
    [TrashCategory.RECYCLABLE]: {
      icon: "refresh-outline",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      description: t("orderCreate.categoryRecyclableDescription")
    },
    [TrashCategory.HAZARDOUS]: {
      icon: "warning-outline",
      color: "bg-red-100 text-red-800 border-red-200",
      description: t("orderCreate.categoryHazardousDescription")
    },
    [TrashCategory.ELECTRONIC]: {
      icon: "phone-portrait-outline",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      description: t("orderCreate.categoryElectronicDescription")
    },
  };

  if (isLoadingOrder) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">{t("orderUpdate.loadingOrder")}</Text>
      </SafeAreaView>
    );
  }

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
              <Text className="text-2xl font-bold text-gray-800">{t("orderUpdate.updateOrderTitle")}</Text>
              <View className="w-10" />
            </View>

            {/* Location Section */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">{t("orderUpdate.locationSectionTitle")}</Text>

              <TouchableOpacity
                className="border-2 border-dashed border-blue-300 p-4 rounded-xl bg-blue-50 mb-3"
                onPress={() => setLocationPickerVisible(true)}
              >
                <View className="items-center">
                  <Ionicons name="location-outline" size={32} color="#3B82F6" />
                  <Text className="text-blue-600 font-medium mt-2">
                    {location ? t("orderUpdate.changeLocation") : t("orderUpdate.selectLocation")}
                  </Text>
                  {location && (
                    <Text className="text-xs text-gray-500 mt-1">
                      {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              <View className="bg-gray-50 p-3 rounded-xl">
                <Text className="text-sm text-gray-600 mb-1">{t("orderUpdate.addressLabel")}</Text>
                {isReversing ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" />
                    <Text className="ml-2 text-gray-500">{t("orderUpdate.gettingAddress")}</Text>
                  </View>
                ) : (
                  <Controller
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <Text className="text-gray-800 text-base">
                        {field.value || t("orderUpdate.noAddressSelected")}
                      </Text>
                    )}
                  />
                )}
              </View>
              {errors.address && (
                <Text className="text-red-500 text-sm mt-1 ml-1">{t(`orderUpdate.${errors.address.message}`)}</Text>
              )}
            </View>

            {/* Trash Category Section */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">{t("orderUpdate.categorySectionTitle")}</Text>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                  <View className="space-y-2">
                    {Object.entries(CATEGORY_INFO).map(([category, info]) => (
                      <TouchableOpacity
                        key={category}
                        className={`p-4 rounded-xl border-2 ${
                          (value || selectedCategory) === category
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
                            color={(value || selectedCategory) === category ?
                              (category === TrashCategory.GENERAL ? "#374151" :
                               category === TrashCategory.ORGANIC ? "#065F46" :
                               category === TrashCategory.RECYCLABLE ? "#1E40AF" :
                               category === TrashCategory.HAZARDOUS ? "#991B1B" : "#581C87")
                              : "#9CA3AF"
                            }
                          />
                          <View className="ml-3 flex-1">
                            <Text className={`font-medium ${
                              (value || selectedCategory) === category ? "text-gray-800" : "text-gray-600"
                            }`}>
                              {t(`orderCreate.category_${category.toLowerCase()}`)}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">
                              {info.description}
                            </Text>
                          </View>
                          {(value || selectedCategory) === category && (
                            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
              {errors.category && (
                <Text className="text-red-500 text-sm mt-1 ml-1">{t(`orderUpdate.${errors.category.message}`)}</Text>
              )}
            </View>

            {/* Weight Section */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">{t("orderUpdate.weightSectionTitle")}</Text>
              <Controller
                control={control}
                name="weight"
                render={({ field }) => (
                  <View className="relative">
                    <TextInput
                      className="border-2 border-gray-200 p-4 rounded-xl text-base bg-white"
                      keyboardType="numeric"
                      placeholder={t("orderUpdate.enterWeightPlaceholder")}
                      value={field.value ? String(field.value) : ""}
                      onChangeText={field.onChange}
                    />
                    <View className="absolute right-4 top-4">
                      <Text className="text-gray-500 font-medium">kg</Text>
                    </View>
                  </View>
                )}
              />
              {errors.weight && (
                <Text className="text-red-500 text-sm mt-1 ml-1">{t(`${errors.weight.message}`)}</Text>
              )}
            </View>

            {/* Description Section */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">{t("orderUpdate.descriptionSectionTitle")}</Text>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TextInput
                    className="border-2 border-gray-200 p-4 rounded-xl text-base bg-white"
                    multiline
                    numberOfLines={4}
                    placeholder={t("orderUpdate.descriptionPlaceholder")}
                    onChangeText={field.onChange}
                    value={field.value || ""}
                    textAlignVertical="top"
                  />
                )}
              />
            </View>

            {/* Image Section */}
            <View className="mb-8">
              <Text className="text-lg font-semibold text-gray-800 mb-3">{t("orderUpdate.photoSectionTitle")}</Text>

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
                    <Text className="text-gray-500 font-medium mt-2">{t("orderUpdate.addPhoto")}</Text>
                    <Text className="text-gray-400 text-sm mt-1">{t("orderUpdate.tapToSelectImage")}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`p-4 rounded-xl ${
                isUpdating
                  ? "bg-gray-300"
                  : "bg-blue-500"
              }`}
              onPress={handleSubmit(onSubmit)}
              disabled={isUpdating}
            >
              <View className="flex-row items-center justify-center">
                {isUpdating && <ActivityIndicator size="small" color="white" className="mr-2" />}
                <Text className={`font-semibold text-base ${
                  isUpdating ? "text-gray-500" : "text-white"
                }`}>
                  {isUpdating ? t("orderUpdate.updatingOrder") : t("orderUpdate.updateOrderButton")}
                </Text>
              </View>
            </TouchableOpacity>
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