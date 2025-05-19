import { login, register } from "@/apis/auth";
import { RegisterRequest, ApiResponse, UserResponse, LoginRequest, AuthResponse } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./useToast";
import { useAuthContext } from "./useAuthContext";

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
    onSuccess: (response: ApiResponse<UserResponse>) => {
      const result = response.result as UserResponse;
    },
  });
}

export const useLogin = () => {
  const { fcmToken, setAuth } = useAuthContext();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (response: ApiResponse<AuthResponse>) => {
      const result = response.result as AuthResponse;
      setAuth({
        token: result.token,
        userId: result.userId,
        username: result.username,
        fcmToken: fcmToken, // persist fcmToken
        role: result.role
      });
    },
  });
}

export const useLogout = () => {
  const { clearAuth } = useAuthContext();
  const { showToast } = useToast();

  const logout = () => {
    clearAuth();
    showToast("Logged out successfully", "success");
  }


  return { logout };
}