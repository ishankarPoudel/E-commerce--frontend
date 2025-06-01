import Login from "@/ui/pages/Auth/Login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Login />
    </div>
  );
}
