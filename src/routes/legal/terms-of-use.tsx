import { TermsOfUse } from "@/ui/pages/Legal/TermsOfUse";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/terms-of-use")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <TermsOfUse />
    </div>
  );
}
