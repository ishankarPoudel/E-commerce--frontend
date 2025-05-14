import AdminDashboardLayout from "@/ui/layouts/AdminDashboardLayout";
import BagList from "@/ui/pages/Admin/bags/BagList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-dashboard/bags/viewBags")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminDashboardLayout>
      <BagList />
    </AdminDashboardLayout>
  );
}
