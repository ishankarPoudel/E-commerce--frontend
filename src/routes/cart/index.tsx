import LandingPageLayout from "@/ui/layouts/LandingPageLayout";
import CartPage from "@/ui/pages/Customer/Cart/CartPage";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cart/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <LandingPageLayout>
        <CartPage />
      </LandingPageLayout>
    </>
  );
}
