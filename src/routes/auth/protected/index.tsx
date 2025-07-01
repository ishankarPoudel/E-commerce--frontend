import SamplePage from "@/ui/pages/sample/SamplePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/protected/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>Protected Route</h1>
      <p>This route is protected and requires authentication.</p>
      <p>You can access this route only if you are logged in.</p>
      <SamplePage />
    </div>
  );
}
