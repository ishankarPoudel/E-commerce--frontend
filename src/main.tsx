import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./ui/shadcn/sonner";
import { client } from "./api/client.gen";

client.setConfig({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
});

// Track refresh token state
let isRefreshing = false;

let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const url = input instanceof Request ? input.url : input.toString();

  // ✅ DEBUG: Log every request
  console.log("📡 REQUEST:", url);

  const response = await originalFetch(input, init);

  // ✅ DEBUG: Log every response
  console.log("📡 RESPONSE:", url, {
    status: response.status,
    ok: response.ok,
  });

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
    console.log("🚨 AUTH ERROR DETECTED:", {
      url,
      status: response.status,
      isAuthEndpoint,
    });

    const responseClone = response.clone();

    try {
      const data = await responseClone.json();

      // ✅ DEBUG: Log the full error response
      console.log("🚨 ERROR DATA:", {
        url,
        status: response.status,
        errorType: data.errorType,
        message: data.message,
        forceLogout: data.forceLogout,
        fullData: data,
      });

      const errorType = data.errorType || "unknown";
      const currentPath = window.location.pathname;

      console.log("🔍 HANDLING ERROR TYPE:", errorType);

      switch (errorType) {
        case "guest_user": {
          console.log("❌ CASE: guest_user");
          if (!window.location.pathname.includes("/auth/login")) {
            window.location.replace(
              `/auth/login?error=guest_user&redirect=${encodeURIComponent(currentPath)}`,
            );
          }
          return response;
        }

        case "token_expired": {
          console.log("⏰ CASE: token_expired - Access token expired");

          if (!isRefreshing) {
            isRefreshing = true;
            console.log("🔄 Starting token refresh...");

            try {
              console.log("🔄 Calling refresh endpoint...");
              const refreshResponse = await originalFetch(
                `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                },
              );

              console.log(
                "🔄 Refresh response status:",
                refreshResponse.status,
              );

              if (!refreshResponse.ok) {
                const errorData = await refreshResponse.json();
                console.error("❌ Refresh failed:", errorData);

                const refreshErrorType = errorData.errorType;
                const shouldForceLogout = errorData.forceLogout;

                isRefreshing = false;
                processQueue(new Error(errorData.message || "Refresh failed"));

                if (
                  refreshErrorType === "session_expired" &&
                  shouldForceLogout
                ) {
                  console.log(
                    "⏰ Session expired (refresh token expired) - logging out",
                  );

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
                    `/auth/login?error=session_expired&message=${encodeURIComponent("Your session has expired. Please log in again.")}&redirect=${encodeURIComponent(currentPath)}`,
                  );
                  return response;
                } else if (refreshErrorType === "account_banned") {
                  console.log("⛔ Account banned - logging out");

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
                    `/auth/login?error=account_banned&message=${encodeURIComponent("Your account has been banned. Contact support.")}`,
                  );
                  return response;
                } else if (refreshErrorType === "session_revoked") {
                  console.log("🚫 Session revoked by admin - logging out");

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
                    `/auth/login?error=session_revoked&message=${encodeURIComponent("Your session has been revoked by an administrator.")}`,
                  );
                  return response;
                } else if (shouldForceLogout) {
                  console.log("🚪 Force logout - clearing session");

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
                    `/auth/login?error=${refreshErrorType || "invalid_session"}&redirect=${encodeURIComponent(currentPath)}`,
                  );
                  return response;
                } else {
                  console.log("👤 Guest user - redirecting to login");
                  window.location.replace(
                    `/auth/login?error=guest_user&redirect=${encodeURIComponent(currentPath)}`,
                  );
                  return response;
                }
              }

              const refreshData = await refreshResponse.json();
              console.log("✅ Token refreshed successfully:", refreshData);

              isRefreshing = false;
              processQueue();

              console.log("🔄 Retrying original request:", url);
              return await originalFetch(input, init);
            } catch (refreshError) {
              console.error("❌ Unexpected refresh error:", refreshError);
              isRefreshing = false;
              processQueue(refreshError);

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
                `/auth/login?error=network_error&redirect=${encodeURIComponent(currentPath)}`,
              );
              return response;
            }
          } else {
            console.log("⏳ Refresh in progress - queuing request");

            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => {
                console.log("🔄 Retrying queued request:", url);
                return originalFetch(input, init);
              })
              .catch((error) => {
                console.error("❌ Queued request failed:", error);
                return response;
              });
          }
        }

        case "session_revoked": {
          console.log("🚫 CASE: session_revoked");
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
          window.location.replace("/auth/login?error=session_revoked");
          return response;
        }

        case "account_banned": {
          console.log("⛔ CASE: account_banned");
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
          window.location.replace("/auth/login?error=account_banned");
          return response;
        }

        case "invalid_token":
        case "user_not_found": {
          console.log("❌ CASE: invalid_token/user_not_found");
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
          return response;
        }

        case "insufficient_permissions": {
          console.log("⚠️ CASE: insufficient_permissions");
          return response;
        }

        default: {
          console.warn("⚠️ CASE: default/unknown -", errorType);

          if (data.forceLogout === true) {
            console.log("🚪 Force logout flag set");
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
      console.error("❌ Could not parse error response:", parseError);

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
