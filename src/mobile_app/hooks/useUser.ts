import { useQuery } from "@tanstack/react-query";
import { getDriversNotAssigned, getUserById, getUsers } from "@/apis/user";
import { ApiResponse, UserResponse } from "@/types/types";

export const useGetDriversNotAssigned = () => {
  return useQuery<ApiResponse<UserResponse[]>>({
    queryKey: ["drivers", "not-assigned"],
    queryFn: () => getDriversNotAssigned(),
  });
};

export const useGetUsers = () => {
  return useQuery<ApiResponse<UserResponse[]>>({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery<ApiResponse<UserResponse>>({
    queryKey: ["users", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId
  });
};
