import { login, register } from "@/apis/auth";
import { RegisterRequest, ApiResponse, LoginRequest, AuthResponse } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "./useAuthContext";
import { useToast } from "./useToast";

export const useRegister = () => {
  const {showToast} = useToast();

  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
    onSuccess: (response) => {
      showToast(response.message, "success");
    },
  });
}

export const useLogin = () => {
  const {showToast} = useToast();
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
      showToast(response.message, "success");
    },
  });
}

export const useLogout = () => {
  const { clearAuth } = useAuthContext();

  const logout = () => {
    clearAuth();
  }


  return { logout };
}