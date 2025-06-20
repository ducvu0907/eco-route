import { useRegister } from "@/hooks/useAuth";
import { Role } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Pressable, Text, TextInput, TouchableWithoutFeedback, View, ScrollView } from "react-native";
import { z } from "zod";
import {Picker} from '@react-native-picker/picker';
import { useAuthContext } from "@/hooks/useAuthContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation

const formSchema = z.object({
  username: z.string().min(1, "usernameRequired"), // Use translation key
  password: z.string().min(1, "passwordRequired"), // Use translation key
  phone: z.string().min(1, "phoneRequired"), // Use translation key
  fcmToken: z.string().nullable(),
  role: z.nativeEnum(Role, {
    errorMap: () => ({message: "roleRequired"}), // Use translation key
  }),
});

type RegisterForm = z.infer<typeof formSchema>;

export default function Register() {
  const { t } = useTranslation();
  const {fcmToken} = useAuthContext();
  const { mutate: register, isPending } = useRegister();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      phone: "",
      fcmToken: fcmToken,
      role: undefined,
    },
  });

  const onSubmit = (data: RegisterForm) => {
    register(data);
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-gradient-to-b from-slate-50 to-white">
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            {/* Header Section */}
            <View className="pt-12 pb-6 px-6">
              <View className="items-center mb-6">
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                  {t("register.createAccount")}
                </Text>
                <Text className="text-gray-500 text-center">
                  {t("register.joinUs")}
                </Text>
              </View>
            </View>

            {/* Form Section */}
            <View className="px-6 pb-8">
              <View className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <View className="space-y-5">
                  <View>
                    <Text className="text-gray-700 mb-3 font-semibold text-base">{t("register.username")}</Text>
                    <Controller
                      control={control}
                      name="username"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className={`bg-gray-50 px-4 py-4 rounded-2xl text-base border-2 ${
                            errors.username 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-transparent focus:border-green-300'
                          }`}
                          placeholder={t("register.chooseUsername")}
                          placeholderTextColor="#9CA3AF"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          autoCapitalize="none"
                        />
                      )}
                    />
                    {errors.username && (
                      <Text className="text-red-500 text-sm mt-2 ml-1">
                        {t(`register.${errors.username.message}`)}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-gray-700 mb-3 font-semibold text-base">{t("register.password")}</Text>
                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className={`bg-gray-50 px-4 py-4 rounded-2xl text-base border-2 ${
                            errors.password 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-transparent focus:border-green-300'
                          }`}
                          placeholder={t("register.createSecurePassword")}
                          placeholderTextColor="#9CA3AF"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          secureTextEntry
                        />
                      )}
                    />
                    {errors.password && (
                      <Text className="text-red-500 text-sm mt-2 ml-1">
                        {t(`register.${errors.password.message}`)}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-gray-700 mb-3 font-semibold text-base">{t("register.phoneNumber")}</Text>
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          className={`bg-gray-50 px-4 py-4 rounded-2xl text-base border-2 ${
                            errors.phone 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-transparent focus:border-green-300'
                          }`}
                          placeholder={t("register.enterPhoneNumber")}
                          placeholderTextColor="#9CA3AF"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          keyboardType="phone-pad"
                        />
                      )}
                    />
                    {errors.phone && (
                      <Text className="text-red-500 text-sm mt-2 ml-1">
                        {t(`register.${errors.phone.message}`)}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-gray-700 mb-3 font-semibold text-base">{t("register.role")}</Text>
                    <View className={`bg-gray-50 rounded-2xl border-2 ${
                      errors.role ? 'border-red-300 bg-red-50' : 'border-transparent'
                    }`}>
                      <Controller
                        control={control}
                        name="role"
                        render={({ field: { onChange, value } }) => (
                          <Picker
                            selectedValue={value}
                            onValueChange={(itemValue) => onChange(itemValue)}
                            style={{ 
                              backgroundColor: errors.role ? '#FEF2F2' : '#F9FAFB',
                              borderRadius: 16,
                              marginHorizontal: 4,
                              marginVertical: 4
                            }}
                          >
                            <Picker.Item 
                              label={t("register.selectYourRole")} 
                              value={undefined} 
                              color="#9CA3AF"
                            />
                            <Picker.Item 
                              label={t("register.customerRole")} 
                              value={Role.CUSTOMER} 
                              color="#374151"
                            />
                            <Picker.Item 
                              label={t("register.driverRole")} 
                              value={Role.DRIVER} 
                              color="#374151"
                            />
                          </Picker>
                        )}
                      />
                    </View>
                    {errors.role && (
                      <Text className="text-red-500 text-sm mt-2 ml-1">
                        {t(`register.${errors.role.message}`)}
                      </Text>
                    )}
                  </View>

                  <Pressable
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending}
                    className={`rounded-2xl py-4 mt-6 shadow-lg ${
                      isPending 
                        ? 'bg-green-400' 
                        : 'bg-green-500 active:bg-green-600'
                    }`}
                    style={{
                      shadowColor: '#10B981',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 8,
                    }}
                  >
                    <View className="flex-row justify-center items-center">
                      {isPending && (
                        <ActivityIndicator color="white" className="mr-3" />
                      )}
                      <Text className="text-white font-semibold text-lg">
                        {isPending ? t("register.creatingAccount") : t("register.createAccountButton")}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>

              {/* Footer */}
              <View className="items-center mt-6 mb-4">
                <Pressable
                  onPress={() => router.replace("/login")}
                  className="py-3 px-6"
                >
                  <Text className="text-gray-600 text-center">
                    {t("register.alreadyHaveAccount")}{' '}
                    <Text className="text-green-500 font-semibold">{t("register.signIn")}</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}