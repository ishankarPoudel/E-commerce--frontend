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
import { useQuery } from "@tanstack/react-query";
import { getUserByIdOptions } from "@/api/@tanstack/react-query.gen";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/shadcn/button";
import { LogOut } from "lucide-react";
import LogoutDialog from "@/ui/molecules/dialogs/LogoutDialog";
import { useState } from "react";

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const { state } = useSidebar();
  const { data: loggedInUser, isPending: isUserLoading } = useQuery({
    ...getUserByIdOptions(),
  });
  const user = {
    name: loggedInUser?.data?.fullName || "User",
    email: loggedInUser?.data?.email || "user@example.com",
  };

  return (
    <Sidebar
      collapsible='icon'
      side='left'
      className='group border-r bg-white shadow-sm'>
      <SidebarHeader className='border-b pb-4'>
        <div className='flex items-center gap-3 px-6 pt-4'>
          <span
            className={cn(
              "text-black font-semibold select-none tracking-wide transition-all",
              state === "collapsed" ? "text-sm leading-none" : "text-base"
            )}>
            AB
          </span>
          <div
            className={cn(
              "flex flex-col transition-all origin-left",
              state === "collapsed" &&
                "opacity-0 -translate-x-2 pointer-events-none w-0 overflow-hidden"
            )}>
            <span className='text-lg font-semibold'>Avisekh Bags</span>
            <span className='text-xs text-muted-foreground'>
              Customer Portal
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SideBarMenu navLinks={customerNavLinks} />
      </SidebarContent>

      {isUserLoading ? (
        <>
          <div className='animate-pulse mt-auto border-t p-4'>
            <div className='h-4 w-1/2 rounded bg-muted' />
          </div>
        </>
      ) : (
        <>
          <SidebarFooter className='mt-auto border-t p-4'>
            <div className='flex items-center gap-3 px-2'>
              <Avatar>
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className='flex flex-1 flex-col overflow-hidden'>
                <span className='truncate text-sm font-medium'>
                  {user.name}
                </span>
                <span className='truncate text-xs text-muted-foreground'>
                  {user.email}
                </span>
              </div>
              <Button
                onClick={() => setOpen(true)}
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-muted-foreground hover:text-black'>
                <LogOut className='h-4 w-4' />
                <span className='sr-only'>Log out</span>
              </Button>
              <LogoutDialog open={open} setOpen={setOpen} />
            </div>
          </SidebarFooter>
          <SidebarRail />
        </>
      )}
    </Sidebar>
  );
}
