import { useState, useEffect } from "react";

interface NativeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  fallbackSrc?: string;
  blurDataURL?: string; // base64 tiny image
}

export function Image({
  src,
  alt,
  fill = false,
  priority = false,
  sizes,
  fallbackSrc = "/placeholder.svg",
  blurDataURL,
  className = "",
  ...rest
}: NativeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Preload if priority=true (same behavior as Next.js)
  useEffect(() => {
    if (!priority) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  }, [priority, src]);

  const handleError = () => setCurrentSrc(fallbackSrc);
  const handleLoad = () => setLoaded(true);

  return (
    <div
      className={
        (fill ? "relative w-full h-full" : "relative w-full") +
        " overflow-hidden"
      }
    >
      {/* BLUR BACKGROUND */}
      {blurDataURL && !loaded && (
        <img
          src={blurDataURL}
          aria-hidden="true"
          className={
            (fill ? "absolute inset-0 w-full h-full" : "w-full") +
            " object-cover blur-xl scale-110 transform opacity-60 transition-all duration-500"
          }
        />
      )}

      {/* MAIN IMAGE */}
      <img
        src={currentSrc}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        onError={handleError}
        onLoad={handleLoad}
        className={
          (fill ? "absolute inset-0 w-full h-full" : "w-full") +
          " object-cover transition-transform duration-500 group-hover:scale-105 " +
          // Fade-in effect when loaded
          (loaded ? "opacity-100" : "opacity-0") +
          " transition-opacity duration-700 " +
          className
        }
        {...rest}
      />
    </div>
  );
}
