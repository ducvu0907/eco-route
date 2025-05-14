import { useAuthContext } from "@/hooks/useAuthContext";
import { Role } from "@/types/types";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { role, isAuthenticated, isLoading } = useAuthContext();
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href={role === Role.CUSTOMER ? "/(tabs-customer)/orders" : "/(tabs-driver)/vehicle"} />;
  }

  return <Redirect href={"/login"}/>

}
