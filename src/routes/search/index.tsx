import LandingPageLayout from "@/ui/layouts/LandingPageLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <LandingPageLayout>hello world</LandingPageLayout>
    </>
  );
}
