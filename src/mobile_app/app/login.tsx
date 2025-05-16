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
        <View className="flex-1 bg-white p-6">
          <View className="flex-1 justify-center">
            <Text className="text-3xl font-bold text-center mb-8 text-blue-600">
              Welcome Back
            </Text>

            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Username</Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-gray-100 px-4 py-3 rounded-lg ${errors.username ? 'border border-red-500' : ''}`}
                    placeholder="Enter your username"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.username && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </Text>
              )}
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-gray-100 px-4 py-3 rounded-lg ${errors.password ? 'border border-red-500' : ''}`}
                    placeholder="Enter your password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
              />
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </Text>
              )}
            </View>

            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
              className={`rounded-lg py-4 ${isPending ? 'bg-blue-400' : 'bg-blue-600'}`}
            >
              <View className="flex-row justify-center items-center">
                {isPending ? (
                  <ActivityIndicator color="white" className="mr-2" />
                ) : null}
                <Text className="text-white font-medium text-center">
                  {isPending ? 'Logging in...' : 'Login'}
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.replace("/register")}
              className="mt-4"
            >
              <Text className="text-blue-600 text-center">
                Don't have an account? Sign up
              </Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
