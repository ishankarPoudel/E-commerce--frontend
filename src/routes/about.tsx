import AboutUsPage from "@/ui/pages/AboutUsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <AboutUsPage />
    </div>
  );
}
