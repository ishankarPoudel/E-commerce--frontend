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

// Track refresh token state
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const response = await originalFetch(input, init);
  const url = input instanceof Request ? input.url : input.toString();

  // Skip auth endpoints
  const isAuthEndpoint =
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/verify-otp") ||
    url.includes("/auth/reset-password") ||
    url.includes("/auth/recover-password") ||
    url.includes("/auth/google") ||
    url.includes("/auth/refresh-token") ||
    url.includes("/auth/logout") ||
    url.includes("/auth/google/callback") ||
    url.includes("/legal/privacy-policy") ||
    url.includes("/legal/terms-of-use");

  // ✅ Don't redirect if it's the /user/me endpoint
  if (url.includes("/user/me") && response.status === 401) {
    console.log("👤 User not logged in - allowing guest access");
    return response;
  }
  // Handle 401/403 errors
  if (
    (response.status === 401 || response.status === 403) &&
    url.includes(import.meta.env.VITE_API_URL) &&
    !isAuthEndpoint
  ) {
    const responseClone = response.clone();

    try {
      const data = await responseClone.json();

      //  Get errorType
      const errorType = data.errorType || "unknown";
      const currentPath = window.location.pathname;

      //  Handle based on errorType FIRST
      switch (errorType) {
        case "guest_user": {
          //User not logged in - DON'T clear storage, DON'T try refresh

          if (!window.location.pathname.includes("/auth/login")) {
            window.location.replace(
              `/auth/login?error=guest_user&redirect=${encodeURIComponent(currentPath)}`,
            );
          }
          return response;
        }

        case "token_expired": {
          // Token exists but expired - TRY refresh
          console.log(" Token expired - attempting refresh");

          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = refreshToken({ throwOnError: false });

            try {
              await refreshPromise;
              console.log(" Token refreshed successfully");
              isRefreshing = false;
              refreshPromise = null;

              // Retry original request
              return await originalFetch(input, init);
            } catch (refreshError) {
              console.error(" Refresh failed:", refreshError);
              isRefreshing = false;
              refreshPromise = null;

              // Clear and redirect
              localStorage.clear();
              sessionStorage.clear();
              document.cookie.split(";").forEach((c) => {
                document.cookie = c
                  .replace(/^ +/, "")
                  .replace(
                    /=.*/,
                    "=;expires=" + new Date().toUTCString() + ";path=/",
                  );
              });
              window.location.replace(
                `/auth/login?error=session_expired&redirect=${encodeURIComponent(currentPath)}`,
              );
            }
          } else {
            // Wait for ongoing refresh
            await refreshPromise;
            return await originalFetch(input, init);
          }
          return response;
        }

        case "session_revoked": {
          // Admin revoked session
          console.log("Session revoked by admin");
          localStorage.clear();
          sessionStorage.clear();

          // Clear cookies
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(
                /=.*/,
                "=;expires=" + new Date().toUTCString() + ";path=/",
              );
          });

          window.location.replace("/auth/login?error=session_revoked");
          return response;
        }

        case "account_banned": {
          // Account banned
          console.log("Account banned");
          localStorage.clear();
          sessionStorage.clear();

          // Clear cookies
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(
                /=.*/,
                "=;expires=" + new Date().toUTCString() + ";path=/",
              );
          });

          window.location.replace("/auth/login?error=account_banned");
          return response;
        }

        case "invalid_token":
        case "user_not_found": {
          // Invalid/corrupted token or user deleted
          console.log("Invalid session");
          localStorage.clear();
          sessionStorage.clear();

          // Clear cookies
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(
                /=.*/,
                "=;expires=" + new Date().toUTCString() + ";path=/",
              );
          });

          window.location.replace(
            `/auth/login?error=session_expired&redirect=${encodeURIComponent(currentPath)}`,
          );
          return response;
        }

        case "insufficient_permissions": {
          //  User authenticated but not authorized - DON'T logout
          console.log("Insufficient permissions");

          return response;
        }

        default: {
          // Unknown error - check forceLogout as fallback
          console.warn(` Unknown errorType: ${errorType}`);

          if (data.forceLogout === true) {
            console.log(" Force logout flag set");
            localStorage.clear();
            sessionStorage.clear();

            document.cookie.split(";").forEach((c) => {
              document.cookie = c
                .replace(/^ +/, "")
                .replace(
                  /=.*/,
                  "=;expires=" + new Date().toUTCString() + ";path=/",
                );
            });

            window.location.replace(
              `/auth/login?error=session_expired&redirect=${encodeURIComponent(currentPath)}`,
            );
          }
          return response;
        }
      }
    } catch (parseError) {
      // Can't parse JSON response
      console.error(" Could not parse error response:", parseError);

      if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        sessionStorage.clear();
        const currentPath = window.location.pathname;
        window.location.replace(
          `/auth/login?error=session_expired&redirect=${encodeURIComponent(currentPath)}`,
        );
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
