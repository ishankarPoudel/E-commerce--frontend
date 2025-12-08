import { AppSidebar } from "@/components/App-sidebar";
import { SidebarProvider, SidebarTrigger } from "../shadcn/sidebar";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content Area - Fixed height with overflow */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <SidebarTrigger />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default LandingPageLayout;
