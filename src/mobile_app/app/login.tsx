import { useLogin } from "@/hooks/useAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, Text, TextInput, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  fcmToken: z.string().nullable(),
});

type LoginForm = z.infer<typeof formSchema>;

export default function Login() {
  const { fcmToken } = useAuthContext();
  const { mutate: login, isPending } = useLogin();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      fcmToken: fcmToken as string || null,
    },
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data);
    login(data);
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-gradient-to-b from-slate-50 to-white">
          {/* Header Section */}
          <View className="pt-16 pb-8 px-6">
            <View className="items-center mb-8">
              {/* <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4 shadow-lg">
                <Text className="text-white text-2xl font-bold">Login</Text>
              </View> */}
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </Text>
              <Text className="text-gray-500 text-center">
                Sign in to continue to your account
              </Text>
            </View>
          </View>

          {/* Form Section */}
          <View className="flex-1 px-6">
            <View className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <View className="space-y-5">
                <View>
                  <Text className="text-gray-700 mb-3 font-semibold text-base">Username</Text>
                  <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className={`bg-gray-50 px-4 py-4 rounded-2xl text-base border-2 ${
                          errors.username 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-transparent focus:border-blue-300'
                        }`}
                        placeholder="Enter your username"
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
                      {errors.username.message}
                    </Text>
                  )}
                </View>

                <View>
                  <Text className="text-gray-700 mb-3 font-semibold text-base">Password</Text>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className={`bg-gray-50 px-4 py-4 rounded-2xl text-base border-2 ${
                          errors.password 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-transparent focus:border-blue-300'
                        }`}
                        placeholder="Enter your password"
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
                      {errors.password.message}
                    </Text>
                  )}
                </View>

                <Pressable
                  onPress={handleSubmit(onSubmit)}
                  disabled={isPending}
                  className={`rounded-2xl py-4 mt-6 shadow-lg ${
                    isPending 
                      ? 'bg-blue-400' 
                      : 'bg-blue-500 active:bg-blue-600'
                  }`}
                  style={{
                    shadowColor: '#3B82F6',
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
                      {isPending ? 'Signing In...' : 'Sign In'}
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Footer */}
            <View className="items-center mt-8 mb-8">
              <Pressable
                onPress={() => router.replace("/register")}
                className="py-3 px-6"
              >
                <Text className="text-gray-600 text-center">
                  Don't have an account?{' '}
                  <Text className="text-blue-500 font-semibold">Sign up</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}