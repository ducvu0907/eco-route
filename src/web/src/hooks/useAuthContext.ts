import { AuthContext, AuthContextType } from "@/contexts/AuthContext";
import { useContext } from "react";

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
