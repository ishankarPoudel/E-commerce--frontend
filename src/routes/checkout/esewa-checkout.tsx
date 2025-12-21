import { EsewaCheckoutPage } from "@/components/EsewaCheckoutPage";
import CheckoutPage from "@/ui/pages/Customer/Cart/CheckoutPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/esewa-checkout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <EsewaCheckoutPage />
    </div>
  );
}
