import AdminLoginPage from "@/ui/pages/Auth/AdminLogin";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login/admin-login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <AdminLoginPage />
    </div>
  );
}
