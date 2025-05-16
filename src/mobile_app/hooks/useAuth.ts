import { login, register } from "@/apis/auth";
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, UserResponse } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "./useAuthContext";
import { useToast } from "./useToast";
import { useRouter } from "expo-router";

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
    onSuccess: (response: ApiResponse<UserResponse>) => {
      const result = response.result as UserResponse;
      router.replace("/login");
    },
  });
}

export const useLogin = () => {
  const { setToken, setRole, setUserId, setUsername, setFcmToken } = useAuthContext();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (response: ApiResponse<AuthResponse>) => {
      const result = response.result as AuthResponse;
        setToken(result.token);
        setUserId(result.userId);
        setUsername(result.username);
        setRole(result.role);
      router.replace("/");
    },
  });
}

export const useLogout = () => {
  const { clearAuth } = useAuthContext();
  const { showToast } = useToast();
  const router = useRouter();

  const logout = () => {
    clearAuth();
    showToast("Logged out successfully", "success");
    router.replace("/login");
  }

  return { logout };
}