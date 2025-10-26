import CheckoutPage from "@/ui/pages/Customer/Cart/CheckoutPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <CheckoutPage />
    </>
  );
}
