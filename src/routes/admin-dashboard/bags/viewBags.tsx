import AdminDashboardLayout from "@/ui/layouts/AdminDashboardLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-dashboard/bags/viewBags")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminDashboardLayout>here is the view bags page</AdminDashboardLayout>
  );
}
