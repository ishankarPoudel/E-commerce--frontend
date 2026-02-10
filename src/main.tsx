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
  headers: {
    "Content-Type": "application/json",
  },
});

const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const response = await originalFetch(input, init);
  const url = input instanceof Request ? input.url : input.toString();

  // Skip force logout check for auth endpoints (login, register, etc.)
  const isAuthEndpoint =
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/verify-otp") ||
    url.includes("/auth/reset-password") ||
    url.includes("/auth/recover-password") ||
    url.includes("/auth/google") ||
    url.includes("/refresh-token") ||
    url.includes("/auth/logout") ||
    url.includes("/auth/google/callback");

  // check force logout FIRST (before token refresh)
  if (
    (response.status === 401 || response.status === 403) &&
    url.includes(import.meta.env.VITE_API_URL) &&
    !isAuthEndpoint
  ) {
    // Clone response to read body without consuming it
    const responseClone = response.clone();

    try {
      const data = await responseClone.json();

      // handle force logout scenarios
      if (data.forceLogout === true) {
        const errorType =
          data.errorType ||
          (response.status === 403 ? "account_banned" : "session_revoked");

        console.log(` FORCE LOGOUT! Type: ${errorType}`);

        // Clear storage
        localStorage.clear();
        sessionStorage.clear();

        // Clear cookies (if accessible)
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/",
            );
        });

        // Redirect with appropriate error message
        console.log(` Redirecting to: /auth/login?error=${errorType}`);
        window.location.replace(`/auth/login?error=${errorType}`);

        // Return response to prevent further processing
        return response;
      }

      //  If not force logout but still 401, try token refresh
      if (response.status === 401 && !data.forceLogout) {
        const isRefreshEndpoint = url.includes("/refresh-token");

        if (!isRefreshEndpoint) {
          console.log("401 without forceLogout - Attempting token refresh...");

          try {
            const refreshResult = await refreshToken({
              throwOnError: false,
            });

            console.log(" Token refreshed successfully:", refreshResult);

            // Clone the original request and retry
            const retryInit = { ...init };
            const retryRequest =
              input instanceof Request ? new Request(input, retryInit) : input;

            console.log("🔄 Retrying original request...");
            return await originalFetch(retryRequest, retryInit);
          } catch (refreshError) {
            console.error(" Failed to refresh token:", refreshError);
            // Redirect to login if refresh fails
            localStorage.clear();
            sessionStorage.clear();
            window.location.replace("/auth/login?error=session_expired");
          }
        }
      }
    } catch (e) {
      // Not JSON response or parsing error
      console.error(" Could not parse response as JSON:", e);

      // If it's 401/403 but not JSON, probably auth issue
      if (response.status === 401 || response.status === 403) {
        console.log(" Non-JSON auth error, redirecting to login");
        localStorage.clear();
        sessionStorage.clear();
        window.location.replace("/auth/login?error=session_expired");
      }
    }
  }

  return response;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (
          error?.status === 401 ||
          error?.status === 403 ||
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});
const router = createRouter({ routeTree, context: { queryClient } });

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
  </QueryClientProvider>,
);
