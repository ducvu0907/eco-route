import { useGetRouteById } from "@/hooks/useRoute";
import { OrderResponse } from "@/types/types";

interface OrderRouteProps {
  order: OrderResponse;
}

export default function OrderRoute({order}: OrderRouteProps) {
  const {data, isLoading, isError} = useGetRouteById(order.routeId || "");
  const route = data?.result;

  if (isLoading) {
    return (

    );
  }

  if (isError) {
    return (
      
    );
  }

  return (
    
  );
}
