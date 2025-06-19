import VerifyOtp from "@/ui/pages/Auth/VerifyOtp";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/register/verify-otp")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <VerifyOtp />
    </>
  );
}
