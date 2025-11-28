import { getAllOrdersOfUserForAdminOptions } from "@/api/@tanstack/react-query.gen";
import AdminDashboardLayout from "@/ui/layouts/AdminDashboardLayout";
import UserOrders from "@/ui/pages/Admin/orders/UserOrders";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-dashboard/orders/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const userId = Route.useParams();

  const {
    data: user,
    isLoading: isUserLoading,
    error,
    refetch,
  } = useQuery({
    ...getAllOrdersOfUserForAdminOptions({
      query: {
        userId: userId.id,
      },
    }),
  });
  return (
    <>
      <AdminDashboardLayout>
        <UserOrders orders={user?.data?.orders} />
      </AdminDashboardLayout>
    </>
  );
}
