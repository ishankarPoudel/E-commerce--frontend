import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminDashboardLayout from "@/ui/layouts/AdminDashboardLayout";
import MainPage from "@/ui/pages/Admin/MainPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <ProtectedRoute requireAdmin={true} redirectTo="/forbidden">
        <AdminDashboardLayout>
          <MainPage />
        </AdminDashboardLayout>
      </ProtectedRoute>
    </div>
  );
}
