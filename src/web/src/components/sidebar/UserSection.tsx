import { useLogout } from "@/hooks/useAuth";
import { useAuthContext } from "@/hooks/useAuthContext";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function UserSection() {
  const { username } = useAuthContext();
  const { logout } = useLogout();

  return (
    <div className="mt-auto">
      <Card className="p-3 rounded-xl mb-2 flex-row items-center gap-3 border-none bg-white shadow-none">
        <Avatar className="h-10 w-10 border-2 border-primary shrink-0">
          <AvatarImage
            src={"https://github.com/shadcn.png"}
            alt={"user avatar"}
            className="rounded-full"
          />
          <AvatarFallback className="text-lg font-semibold">
            {username?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-sm font-semibold text-foreground truncate">
          {username}
        </div>
      </Card>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2 cursor-pointer"
        onClick={logout}
      >
        <LogOut className="w-4 h-4 transition-transform duration-150 ease-in-out group-hover:scale-110" />
        Logout
      </Button>
    </div>
  );
}
