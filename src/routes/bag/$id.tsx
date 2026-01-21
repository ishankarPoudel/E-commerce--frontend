import { getBagByIdOptions } from "@/api/@tanstack/react-query.gen";
import LandingPageLayout from "@/ui/layouts/LandingPageLayout";
import { BagDetail } from "@/ui/pages/Customer/Bag/BagDetail";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/bag/$id")({
  component: RouteComponent,
  loader: async ({ params, context }: { params: any; context: any }) => {
    const queryClient = context.queryClient;
    return queryClient.ensureQueryData(
      getBagByIdOptions({
        path: {
          id: params.id,
        },
      })
    );
  },
});

function RouteComponent() {
  const { id } = useParams({ from: Route.id });
  const { data } = useSuspenseQuery({
    ...getBagByIdOptions({
      path: {
        id: id,
      },
    }),
  });
  console.log("Bag detail data:", data.data);
  const product = data?.data;
  return (
    <>
      <LandingPageLayout>
        <BagDetail product={product as any} />
      </LandingPageLayout>
    </>
  );
}
