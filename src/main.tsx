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
    // Don't refresh if already at the refresh endpoint
    const isRefreshEndpoint = (
      input instanceof Request ? input.url : input.toString()
    ).includes("/refresh-token");

    if (!isRefreshEndpoint) {
      console.log("⚠️ 401 DETECTED! Refreshing token...");

      // Call the refresh endpoint directly
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
        window.location.href = "/login";
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
