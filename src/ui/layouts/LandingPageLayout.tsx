import { AppSidebar } from "@/components/App-sidebar";
import { SidebarProvider, SidebarTrigger } from "../shadcn/sidebar";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen'>
        <AppSidebar />
        <div className='flex flex-1 flex-col'>
          <header className='flex items-center gap-2 p-2'>
            <SidebarTrigger />
          </header>
          <main className='flex-1'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LandingPageLayout;
