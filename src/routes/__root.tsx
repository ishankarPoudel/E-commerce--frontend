import { AuthProvider } from "@/context/authContext";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </>
  ),
});
