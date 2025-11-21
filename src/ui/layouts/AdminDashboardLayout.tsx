import { Sidebar, SidebarProvider, SidebarTrigger } from "../shadcn/sidebar";
import { SideBarMenu } from "@/lib/SidebarMenu";
import { adminNavLinks } from "@/constants/navLink.constant";

const AdminDashboardLayout = ({ children }: { children: any }) => {
  return (
    <div>
      <SidebarProvider>
        <Sidebar collapsible="icon" className="pr-7">
          <SideBarMenu navLinks={adminNavLinks} />
        </Sidebar>
        <SidebarTrigger />
        <main>{children}</main>
      </SidebarProvider>
    </div>
  );
};

export default AdminDashboardLayout;
