import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubscriptions, getSubscriptionById, getSubscriptionByUserId, createSubscription, deleteSubscription, } from "@/apis/subscription";
import { ApiResponse, SubscriptionCreateRequest, SubscriptionResponse, } from "@/types/types";
import { useAuthContext } from "./useAuthContext";

export const useSubscriptions = () => {
  return useQuery<ApiResponse<SubscriptionResponse[]>>({
    queryKey: ["subscriptions"],
    queryFn: getSubscriptions,
  });
}

export const useSubscriptionById = (subscriptionId: string) => {
  return useQuery<ApiResponse<SubscriptionResponse>>({
    queryKey: ["subscriptions", subscriptionId],
    queryFn: () => getSubscriptionById(subscriptionId),
    enabled: !!subscriptionId,
  });

}

export const useSubscriptionByUserId = (userId: string) =>
  useQuery<ApiResponse<SubscriptionResponse>>({
    queryKey: ["users", userId, "subscription"],
    queryFn: () => getSubscriptionByUserId(userId),
  });

export const useCreateSubscription = () => {
  const { userId } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubscriptionCreateRequest) =>
      createSubscription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["users", userId, "subscription"] });
    },
  });
};

export const useDeleteSubscription = () => {
  const { userId } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) => deleteSubscription(subscriptionId),
    onSuccess: (_data, subscriptionId) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions", subscriptionId] });
      queryClient.invalidateQueries({ queryKey: ["users", userId, "subscription"] });
    },
  });
};
