import { customerNavLinks } from "@/constants/navLink.constant";
import { SideBarMenu } from "@/lib/SidebarMenu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/ui/shadcn/sidebar";

import { Avatar, AvatarFallback } from "@/ui/shadcn/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/shadcn/button";
import { LogOut } from "lucide-react";
import LogoutDialog from "@/ui/molecules/dialogs/LogoutDialog";
import { useState } from "react";
import { useAuth } from "@/context/authContext";

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const { state } = useSidebar();
  const { isAdmin, user, isLoading } = useAuth();

  return (
    <Sidebar
      collapsible="icon"
      side="left"
      className="group border-r bg-white shadow-sm"
    >
      <SidebarHeader className="border-b pb-4">
        <div className="flex items-center gap-3 px-6 pt-4">
          <span
            className={cn(
              "text-black font-semibold select-none tracking-wide transition-all",
              state === "collapsed" ? "text-sm leading-none" : "text-base"
            )}
          >
            AB
          </span>
          <div
            className={cn(
              "flex flex-col transition-all origin-left",
              state === "collapsed" &&
                "opacity-0 -translate-x-2 pointer-events-none w-0 overflow-hidden"
            )}
          >
            <span className="text-lg font-semibold">Avisekh Bags</span>
            <span className="text-xs text-muted-foreground">
              {isAdmin ? "Admin" : "Customer"} Portal
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SideBarMenu navLinks={customerNavLinks} />
      </SidebarContent>

      {isLoading ? (
        <div className="animate-pulse mt-auto border-t p-4">
          <div className="flex items-center gap-3 px-2">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-32 rounded bg-muted" />
            </div>
          </div>
        </div>
      ) : user ? (
        <SidebarFooter className="mt-auto border-t p-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.fullName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "flex flex-1 flex-col overflow-hidden transition-all",
                state === "collapsed" &&
                  "opacity-0 -translate-x-2 pointer-events-none w-0"
              )}
            >
              <span className="truncate text-sm font-medium">
                {user.fullName}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <Button
              onClick={() => setOpen(true)}
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 text-muted-foreground hover:text-black",
                state === "collapsed" && "mx-auto"
              )}
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
          <LogoutDialog open={open} setOpen={setOpen} />
        </SidebarFooter>
      ) : null}

      <SidebarRail />
    </Sidebar>
  );
}
