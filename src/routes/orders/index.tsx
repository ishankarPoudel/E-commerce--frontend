import LandingPageLayout from "@/ui/layouts/LandingPageLayout";
import OrderPage from "@/ui/pages/Customer/Orders/OrderPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/orders/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <LandingPageLayout>
        <OrderPage />
      </LandingPageLayout>
    </>
  );
}
