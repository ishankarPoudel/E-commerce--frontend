import { getBagByIdOptions } from "@/api/@tanstack/react-query.gen";
import AdminDashboardLayout from "@/ui/layouts/AdminDashboardLayout";
import UpdateBag from "@/ui/pages/Admin/bags/UpdateBag";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-dashboard/bags/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ strict: false });
  const { data: bag, isPending } = useQuery({
    ...getBagByIdOptions({
      path: {
        id: id!,
      },
    }),
  });
  return (
    <AdminDashboardLayout>
      {bag?.data && <UpdateBag bag={bag.data} />}
    </AdminDashboardLayout>
  );
}
