import { customerNavLinks } from "@/constants/navLink.constant";
import { SideBarMenu } from "@/lib/SidebarMenu";
import { Sidebar, SidebarContent } from "@/ui/shadcn/sidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent />
      <SideBarMenu navLinks={customerNavLinks} />
    </Sidebar>
  );
}
