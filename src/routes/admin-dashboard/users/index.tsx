import AdminDashboardLayout from "@/ui/layouts/AdminDashboardLayout";
import UserList from "@/ui/pages/Admin/user/UserList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-dashboard/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AdminDashboardLayout>
        <UserList />
      </AdminDashboardLayout>
    </>
  );
}
