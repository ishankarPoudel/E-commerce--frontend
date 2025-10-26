import AdminDashboardLayout from "@/ui/layouts/AdminDashboardLayout";
import { BagCategoryForm } from "@/ui/pages/Admin/category/addCategory";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-dashboard/category/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminDashboardLayout>
      <BagCategoryForm />
    </AdminDashboardLayout>
  );
}
