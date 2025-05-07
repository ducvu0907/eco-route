import { register, login, logout } from "@/apis/auth"
import { useToast } from "./useToast"
import { useMutation } from "@tanstack/react-query";
import { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from "@/types/types";
import { useAuth } from "./useAuth";

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
    onSuccess: (response) => {
      const result = response.result as UserResponse;
      console.log(result);
    },
  });
}

export const useLogin = () => {
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (response) => {
      const result = response.result as AuthResponse;
      console.log(result);
      setAuth({
        token: result.token,
        userId: null,
        username: null,
        fcmToken: null,
      });
    },
  });
}

// TODO
export const useLogout = () => {
  const { clearAuth } = useAuth();
  const { showToast } = useToast();
  logout();
  clearAuth(); 
  showToast("Logged out successfully", "success");
}