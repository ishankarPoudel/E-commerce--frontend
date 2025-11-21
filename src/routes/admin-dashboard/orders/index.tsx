import AdminDashboardLayout from "@/ui/layouts/AdminDashboardLayout";
import OrderList from "@/ui/pages/Admin/orders/OrderList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-dashboard/orders/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AdminDashboardLayout>
        <OrderList />
      </AdminDashboardLayout>
    </>
  );
}
