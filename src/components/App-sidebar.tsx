import { SideBarMenu } from "@/lib/SidebarMenu";
import { Sidebar, SidebarContent } from "@/ui/shadcn/sidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent />
      <SideBarMenu />
    </Sidebar>
  );
}
