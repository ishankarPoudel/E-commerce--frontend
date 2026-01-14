import { AppSidebar } from "@/components/App-sidebar";
import { SidebarProvider, SidebarTrigger } from "../shadcn/sidebar";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex h-svh w-full overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col">
          {/* Mobile Header */}
          <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background px-4 md:hidden">
            <SidebarTrigger />
            <span className="text-sm font-semibold">Avisekh Bags</span>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};
export default LandingPageLayout;
