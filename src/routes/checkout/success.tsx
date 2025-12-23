import { EsewaSuccessPage } from "@/ui/pages/Customer/Esewa/EsewaSuccess";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/success")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <EsewaSuccessPage />
    </div>
  );
}
