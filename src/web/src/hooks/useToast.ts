import { toast } from "sonner";

export const useToast = () => {
  const showToast = (message: string, type: "success" | "error") => {
    if (type === "success") {
      toast.success(message, { richColors: true, duration: 3000 });
    } else {
      toast.error(message, { richColors: true, duration: 3000 });
    }
  }

  return { showToast };
};
