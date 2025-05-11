import { useParams } from "react-router";
import NotFound from "../NotFound";
import { useGetOrderById } from "@/hooks/useOrder";

export default function OrderDetails() {
  const { orderId } = useParams<string>();
  if (!orderId) {
    return <NotFound />;
  }

  const { data, isLoading, isError } = useGetOrderById(orderId);

  return (

  );
}
