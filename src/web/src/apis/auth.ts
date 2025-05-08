import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, UserResponse } from "@/types/types"
import axiosInstance from "."

export const register = async (payload: RegisterRequest): Promise<ApiResponse<UserResponse>> => {
  const { data } = await axiosInstance.post("/auth/register", payload);
  return data;
}

export const login = async (payload: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  const { data } = await axiosInstance.post("/auth/login", payload);
  return data;
}
