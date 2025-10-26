import AdminDashboardLayout from "@/ui/layouts/AdminDashboardLayout";
import MainPage from "@/ui/pages/Admin/MainPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <AdminDashboardLayout>
        <MainPage />
      </AdminDashboardLayout>
    </div>
  );
}
