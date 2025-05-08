import { useLogout } from "@/hooks/useAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Text, Button, View } from "react-native";

export default function PersonalInfoScreen() {
  const { logout } = useLogout();

  return (
    <View>
      <Text>personal info</Text>
      <Text>personal info</Text>
      <Text>personal info</Text>
      <Text>personal info</Text>
      <Button title="click" onPress={() => logout()} />
    </View>
  );
}