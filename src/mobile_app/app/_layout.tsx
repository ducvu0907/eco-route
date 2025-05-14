import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0
    },
    mutations: {
      retry: 0
    }
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerShown: false
            }}
          >
          </Stack>
          <Toast />
        </QueryClientProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
