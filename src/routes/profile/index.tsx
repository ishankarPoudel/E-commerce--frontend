import LandingPageLayout from "@/ui/layouts/LandingPageLayout";
import { CustomerProfile } from "@/ui/pages/profile/ProfilePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <LandingPageLayout>
        <CustomerProfile />
      </LandingPageLayout>
    </>
  );
}
