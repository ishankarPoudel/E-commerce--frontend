import { ShoppingCart, LogOut } from "lucide-react";
import { Link } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/ui/shadcn/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/shadcn/avatar";
import { Button } from "@/ui/shadcn/button";
import { useQuery } from "@tanstack/react-query";
import { getUserByIdOptions } from "@/api/@tanstack/react-query.gen";

interface MenuItem {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  url?: string;
}

export function SideBarMenu({ navLinks }: { navLinks: MenuItem[] }) {
  //fn to fetch user data
  const { data: loggedInUser, isPending: isUserLoading } = useQuery({
    ...getUserByIdOptions(),
  });

  const user = {
    name: loggedInUser?.data?.fullName || "Alex Johnsonn",
    email: loggedInUser?.data?.email || "alex@example.com",
  };

  return (
    <Sidebar className='border-r bg-white shadow-sm'>
      <SidebarHeader className='border-b pb-4'>
        <div className='flex items-center gap-3 px-6 pt-4'>
          <div className='flex h-10 w-10 items-center justify-center rounded-md bg-black'>
            <ShoppingCart className='h-5 w-5 text-white' />
          </div>
          <div className='flex flex-col'>
            <span className='text-lg font-semibold'>Avisekh Bags</span>
            <span className='text-xs text-muted-foreground'>
              Customer Portal
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='px-6 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map((item) => (
                <SidebarMenuItem key={item.title} className='p-1'>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className='group relative flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all'>
                      <item.icon className='h-5 w-5 text-gray-500' />
                      <span>{item.title}</span>
                      <div className='absolute inset-y-0 left-0 w-1 rounded-r-md bg-black opacity-0 transition-opacity group-hover:opacity-100 data-[state=active]:opacity-100' />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {isUserLoading ? (
        <div className='flex items-center justify-center p-4'>
          <span> Fetching user...</span>
        </div>
      ) : null}

      <SidebarFooter className='mt-auto border-t p-4'>
        <div className='flex items-center gap-3 px-2'>
          <Avatar>
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-col overflow-hidden'>
            <span className='truncate text-sm font-medium'>{user.name}</span>
            <span className='truncate text-xs text-muted-foreground'>
              {user.email}
            </span>
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-muted-foreground hover:text-black'>
            <LogOut className='h-4 w-4' />
            <span className='sr-only'>Log out</span>
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
