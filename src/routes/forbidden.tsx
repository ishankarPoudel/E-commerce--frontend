import ForbiddenPage from "@/ui/organisms/403/Forbidden";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/forbidden")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <ForbiddenPage />
    </div>
  );
}
