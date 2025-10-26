const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const getImageUrl = (imagePath?: string | null): string | undefined => {
  if (!imagePath) return undefined;

  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;
  return `${BACKEND_URL}${normalizedPath}`;
};
