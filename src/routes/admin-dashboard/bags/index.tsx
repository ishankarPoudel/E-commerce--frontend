import AdminDashboardLayout from "@/ui/layouts/AdminDashboardLayout";
import BagList from "@/ui/pages/Admin/bags/BagList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-dashboard/bags/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <AdminDashboardLayout>
        <BagList />
      </AdminDashboardLayout>
    </div>
  );
}
