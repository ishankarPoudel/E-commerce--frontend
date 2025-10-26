import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/shadcn/sidebar";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface MenuItem {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  url?: string;
}

export function SideBarMenu({ navLinks }: { navLinks: MenuItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className='px-6 text-xs font-medium uppercase tracking-wider text-muted-foreground group-data-[collapsed=true]:hidden'>
        Main Menu
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.title} className='p-1'>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.url}
                    activeProps={{
                      className:
                        "bg-accent text-accent-foreground data-[collapsed=true]:justify-center",
                    }}
                    className='group relative flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-gray-700 transition-all'>
                    <Icon className='h-5 w-5 text-gray-500 shrink-0' />
                    <span
                      className={cn(
                        "truncate transition-all",
                        "group-data-[collapsed=true]:opacity-0",
                        "group-data-[collapsed=true]:translate-x-2",
                        "group-data-[collapsed=true]:pointer-events-none"
                      )}>
                      {item.title}
                    </span>
                    <div className='absolute inset-y-0 left-0 w-1 rounded-r-md bg-black opacity-0 transition-opacity group-hover:opacity-100 data-[state=active]:opacity-100' />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
