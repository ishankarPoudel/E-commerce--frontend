import RecoverPassword from "@/ui/pages/Auth/RecoverPassword";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/recover-password/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id: resetToken } = useParams({ from: "/auth/recover-password/$id" });
  return (
    <>
      <RecoverPassword resetToken={resetToken} />
    </>
  );
}
