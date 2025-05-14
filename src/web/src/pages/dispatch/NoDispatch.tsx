import { useCreateDispatch } from "@/hooks/useDispatch";
import PendingOrdersMap from "@/components/dispatch/PendingOrdersMap";
import PendingOrdersSidebar from "@/components/dispatch/PendingOrdersSidebar";
import { Button } from "@/components/ui/button";

export default function NoDispatch() {
  const { mutate: createDispatch, isPending } = useCreateDispatch();

  return (
    <div className="flex h-screen w-full">
      {/* Left - Map (2/3 width) */}
      <div className="w-2/3 h-full">
        <PendingOrdersMap />
      </div>

      {/* Right - Sidebar (1/3 width) */}
      <div className="w-1/3 h-full flex flex-col border-l border-gray-200">
        <PendingOrdersSidebar />
        <div className="p-4">
          <Button
            onClick={() => createDispatch()}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Dispatching..." : "Create Dispatch"}
          </Button>
        </div>
      </div>
    </div>
  );
}
