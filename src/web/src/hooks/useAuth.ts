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
      console.log(result);
    },
  });
}

export const useLogin = () => {
  const { setAuth } = useAuthContext();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (response: ApiResponse<AuthResponse>) => {
      const result = response.result as AuthResponse;
      console.log(result);
      setAuth({
        token: result.token,
        userId: result.userId,
        username: result.username,
        fcmToken: null,
        role: result.role
      });
    },
  });
}

export const useLogout = () => {
  const { clearAuth } = useAuthContext();
  const { showToast } = useToast();
  clearAuth(); 
  showToast("Logged out successfully", "success");
}