import { ResultPage } from "@/ui/pages/Customer/Cart/ResultPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/result")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <ResultPage />
    </>
  );
}
