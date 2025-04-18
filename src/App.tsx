import { AppSidebar } from "./components/App-sidebar";
import HomePage from "./ui/pages/HomePage";
import { SidebarProvider, SidebarTrigger } from "./ui/shadcn/sidebar";

function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <HomePage />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}

export default App;
