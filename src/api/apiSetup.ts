import { client } from "./client.gen";
import { refreshToken } from "./sdk.gen";

let isRefreshing = false;

export const setupApiClient = () => {
  client.setConfig({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
    credentials: "include",
  });

  // Store the original request methods
  const originalGet = client.get;
  const originalPost = client.post;
  const originalPut = client.put;
  const originalDelete = client.delete;
  const originalPatch = client.patch;

  // Create a wrapper function that handles token refresh
  const createRequestWrapper = (originalMethod: any) => {
    return async function (this: any, options: any) {
      try {
        const response = await originalMethod.call(this, options);
        return response;
      } catch (error: any) {
        console.log("API Error caught:", error);
        console.log("Error details:", {
          status: error?.status,
          response: error?.response,
          data: error?.data,
          url: options?.url,
        });

        // Check for 401 status in multiple places where it might be
        const isUnauthorized =
          error?.status === 401 ||
          error?.response?.status === 401 ||
          error?.data?.status === 401 ||
          (error?.response && error.response.status === 401);

        // If access token expired and it's not already a refresh token request
        if (
          isUnauthorized &&
          !options.url?.includes("/auth/refresh-token") &&
          !isRefreshing
        ) {
          isRefreshing = true;
          try {
            console.log("Access token expired, attempting to refresh...");
            // Pass an empty options object to refreshToken
            const refreshResponse = await refreshToken({});
            console.log("Refresh response:", refreshResponse);
            console.log(
              "Token refreshed successfully, retrying original request..."
            );
            // Retry the original request
            const retryResponse = await originalMethod.call(this, options);
            return retryResponse;
          } catch (refreshError: any) {
            console.error(
              "Session expired. Redirecting to login.",
              refreshError
            );
            window.location.href = "/auth/login";
            throw refreshError;
          } finally {
            isRefreshing = false;
          }
        }
        throw error;
      }
    };
  };

  // Override all HTTP methods
  client.get = createRequestWrapper(originalGet);
  client.post = createRequestWrapper(originalPost);
  client.put = createRequestWrapper(originalPut);
  client.delete = createRequestWrapper(originalDelete);
  client.patch = createRequestWrapper(originalPatch);
};
