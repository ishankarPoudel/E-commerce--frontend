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

  let originalUrl = url;
  let originalInit: RequestInit = { ...init };

  // Clone request details
  if (input instanceof Request) {
    originalUrl = input.url;

    originalInit = {
      method: input.method,
      headers: Object.fromEntries(input.headers.entries()),
      credentials: input.credentials,
      mode: input.mode,
      cache: input.cache,
      redirect: input.redirect,
      referrer: input.referrer,
      integrity: input.integrity,
    };

    // Only add body if request method allows it AND it has a body
    if (
      input.body &&
      !input.bodyUsed &&
      !["GET", "HEAD"].includes(input.method.toUpperCase()) //  Check method
    ) {
      try {
        const clonedRequest = input.clone();
        originalInit.body = await clonedRequest.text();
      } catch (error) {
        console.warn("Could not clone request body:", error);
      }
    }
  } else if (init?.body) {
    //Only add body if method allows it
    const method = (init.method || "GET").toUpperCase();

    if (!["GET", "HEAD"].includes(method)) {
      if (typeof init.body === "string") {
        originalInit = { ...init, body: init.body };
      } else if (init.body instanceof FormData) {
        const formData = new FormData();
        for (const [key, value] of (init.body as FormData).entries()) {
          formData.append(key, value);
        }
        originalInit = { ...init, body: formData };
      } else {
        originalInit = { ...init };
      }
    } else {
      //  For GET/HEAD, remove body
      const { body, ...restInit } = init;
      originalInit = restInit;
    }
  }

  const response = await originalFetch(input, init);

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

  // Special handling for /user/me to allow guest browsing
  if (url.includes("/user/me") && response.status === 401) {
    try {
      const responseClone = response.clone();
      const data = await responseClone.json();

      //  If it's guest_user, return immediately (allow guest browsing)
      if (data.errorType === "guest_user") {
        console.log("👤 Guest user - allowing catalog browsing");
        return response;
      }

      //  If it's token_expired, continue to refresh logic below
      if (data.errorType === "token_expired") {
        // Don't return, let it fall through to the refresh logic
      } else {
        // Other error types, return as-is
        console.log(" Other error type:", data.errorType);
        return response;
      }
    } catch (parseError) {
      console.error(" Could not parse /user/me response:", parseError);
      return response;
    }
  }

  if (
    (response.status === 401 || response.status === 403) &&
    url.includes(import.meta.env.VITE_API_URL) &&
    !isAuthEndpoint
  ) {
    const responseClone = response.clone();

    try {
      const data = await responseClone.json();

      const errorType = data.errorType || "unknown";
      const currentPath = window.location.pathname;

      switch (errorType) {
        case "guest_user": {
          //  For /user/me, we already handled this above
          if (url.includes("/user/me")) {
            return response;
          }

          // For other endpoints, redirect to login
          if (!window.location.pathname.includes("/auth/login")) {
            window.location.replace(
              `/auth/login?error=guest_user&redirect=${encodeURIComponent(currentPath)}`,
            );
          }
          return response;
        }

        case "token_expired": {
          if (!isRefreshing) {
            isRefreshing = true;

            try {
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

              if (!refreshResponse.ok) {
                const errorData = await refreshResponse.json();

                const refreshErrorType = errorData.errorType;
                const shouldForceLogout = errorData.forceLogout;

                isRefreshing = false;
                processQueue(new Error(errorData.message || "Refresh failed"));

                if (
                  refreshErrorType === "session_expired" &&
                  shouldForceLogout
                ) {
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
                  console.log("👤 Guest user");
                  window.location.replace(
                    `/auth/login?error=guest_user&redirect=${encodeURIComponent(currentPath)}`,
                  );
                  return response;
                }
              }

              const refreshData = await refreshResponse.json();

              isRefreshing = false;
              processQueue();

              return await originalFetch(originalUrl, originalInit);
            } catch (refreshError) {
              console.error(" Unexpected refresh error:", refreshError);
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
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => {
                return originalFetch(originalUrl, originalInit);
              })
              .catch(() => {
                return response;
              });
          }
        }

        case "session_revoked": {
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
          return response;
        }

        default: {
          console.warn("CASE: default/unknown -", errorType);

          if (data.forceLogout === true) {
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
