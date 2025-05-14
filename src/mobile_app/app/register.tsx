import { useRegister } from "@/hooks/useAuth";
import { Role } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Pressable, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { z } from "zod";
import {Picker} from '@react-native-picker/picker';

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  phone: z.string().min(1, "Phone is required"),
  fcmToken: z.string().nullable(),
  role: z.nativeEnum(Role, {
    errorMap: () => ({message: "Role is required"}),
  }),
});

type RegisterForm = z.infer<typeof formSchema>;

export default function Register() {
  const { mutate: register, isPending } = useRegister();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      phone: "",
      fcmToken: null,
      role: undefined,
    },
  });

  const onSubmit = (data: RegisterForm) => {
    register(data);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 p-6">
        <View className="flex-1 justify-center mt-8">
          <Text className="text-3xl font-bold text-center mb-8 text-blue-600">
            Create Account
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Username</Text>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-gray-100 px-4 py-3 rounded-lg ${errors.username ? 'border border-red-500' : ''}`}
                  placeholder="Choose a username"
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

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-gray-100 px-4 py-3 rounded-lg ${errors.password ? 'border border-red-500' : ''}`}
                  placeholder="Create a password"
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

          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Phone Number</Text>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-gray-100 px-4 py-3 rounded-lg ${errors.phone ? 'border border-red-500' : ''}`}
                  placeholder="Enter your phone number"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="phone-pad"
                />
              )}
            />
            {errors.phone && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </Text>
            )}
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">Role</Text>
            <View className={`bg-gray-100 rounded-lg overflow-hidden ${errors.role ? 'border border-red-500' : ''}`}>
              <Controller
                control={control}
                name="role"
                render={({ field: { onChange, value } }) => (
                  <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                    style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 16 }}
                  >
                    <Picker.Item label="Select a role" value={undefined} />
                    <Picker.Item label="Customer" value={Role.CUSTOMER} />
                    <Picker.Item label="Driver" value={Role.DRIVER} />
                  </Picker>
                )}
              />
            </View>
            {errors.role && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.role.message}
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
                {isPending ? 'Registering...' : 'Register'}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/login")}
            className="mt-4 mb-8"
          >
            <Text className="text-blue-600 text-center">
              Already have an account? Login
            </Text>
          </Pressable>

        </View>

      </View>
    </TouchableWithoutFeedback>
  );
}