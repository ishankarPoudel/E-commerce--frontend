import AdminDashboardLayout from "@/ui/layouts/AdminDashboardLayout";
import { AddBagForm } from "@/ui/pages/Admin/bags/addBag";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-dashboard/bags")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminDashboardLayout>
      <AddBagForm />
    </AdminDashboardLayout>
  );
}
