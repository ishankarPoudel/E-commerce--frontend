import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./ui/shadcn/sonner";
import { client } from "./api/client.gen";
import { refreshToken } from "./api/sdk.gen";

client.setConfig({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
  credentials: "include",
});

const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const response = await originalFetch(input, init);

  if (
    response.status === 401 &&
    (input instanceof Request ? input.url : input.toString()).includes(
      import.meta.env.VITE_API_URL
    )
  ) {
    const url = input instanceof Request ? input.url : input.toString();

    // Skip force logout check for auth endpoints (login, register, etc.)
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/verify-otp") ||
      url.includes("/auth/reset-password") ||
      url.includes("/auth/recover-password");

    if (!isAuthEndpoint) {
      // Check if session was revoked
      const responseClone = response.clone();
      try {
        const data = await responseClone.json();
        if (data.forceLogout === true) {
          console.log(" Session revoked by admin! Forcing logout...");
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/auth/login?error=session_revoked";
          return response;
        }
      } catch (e) {
        // Not JSON response, continue
      }
    }

    // Don't refresh if already at the refresh endpoint or auth endpoints
    const isRefreshEndpoint = url.includes("/refresh-token");

    if (!isRefreshEndpoint && !isAuthEndpoint) {
      console.log("🔄 401 DETECTED! Refreshing token...");

      try {
        await refreshToken({
          credentials: "include",
          throwOnError: false,
        });
        console.log("✅ Token refreshed successfully!");

        // Clone the original request and retry
        const retryInit = { ...init };
        const retryRequest =
          input instanceof Request ? new Request(input, init) : input;

        return await originalFetch(retryRequest, retryInit);
      } catch (e) {
        console.error("❌ Failed to refresh token:", e);
        // Redirect to login if refresh fails
        localStorage.clear();
        window.location.href = "/auth/login";
      }
    }
  }

  return response;
};

const router = createRouter({ routeTree });
const queryClient = new QueryClient();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <RouterProvider router={router} />
      <Toaster />
    </StrictMode>
  </QueryClientProvider>
);
