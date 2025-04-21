import { Sidebar, SidebarContent, SidebarProvider } from "../shadcn/sidebar";
import { SideBarMenu } from "@/lib/SidebarMenu";
import { adminNavLinks } from "@/constants/navLink.constant";

const AdminDashboardLayout = ({ children }: { children: any }) => {
  return (
    <div>
      <SidebarProvider>
        {/* <AppSidebar /> */}

        <Sidebar>
          <SidebarContent />
          <SideBarMenu navLinks={adminNavLinks} />
        </Sidebar>
        <main>{children}</main>
      </SidebarProvider>
    </div>
  );
};

export default AdminDashboardLayout;
