const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const getImageUrl = (imagePath?: string | null | any): string => {
  // Handle null/undefined
  if (!imagePath) return "/placeholder.png";

  // Handle array (take first image)
  if (Array.isArray(imagePath)) {
    const firstImage = imagePath[0];
    return getImageUrl(firstImage); // Recursive call with first item
  }

  // Handle object with common image properties
  if (typeof imagePath === "object") {
    const url = imagePath.url || imagePath.image || imagePath.src;
    return getImageUrl(url); // Recursive call with extracted URL
  }

  // Handle string (the actual path)
  if (typeof imagePath !== "string") {
    return "/placeholder.png";
  }

  // If already a full URL (http/https/data), return as-is
  if (/^(https?:|data:)/i.test(imagePath)) {
    return imagePath;
  }

  // Add leading slash if needed
  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;

  return `${BACKEND_URL}${normalizedPath}`;
};
