import { AppSidebar } from "@/components/App-sidebar";
import { SidebarProvider, SidebarTrigger } from "../shadcn/sidebar";

const LandingPageLayout = ({ children }: { children: any }) => {
  return (
    <div className='pl-3'>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        {children}
      </SidebarProvider>
    </div>
  );
};

export default LandingPageLayout;
