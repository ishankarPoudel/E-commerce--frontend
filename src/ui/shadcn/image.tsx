import { useEffect, useState } from "react";

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
}: {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  fallbackSrc?: string;
  blurDataURL?: string;
  className?: string;
  [key: string]: any;
}) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  //  Sync internal state whenever src changes
  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false); // reset so the fade animation happens again
  }, [src]);

  const handleError = () => setCurrentSrc(fallbackSrc);
  const handleLoad = () => setLoaded(true);

  return (
    <div
      className={
        (fill ? "relative w-full h-full" : "relative w-full") +
        " overflow-hidden"
      }
    >
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
          (loaded ? "opacity-100" : "opacity-0") +
          " transition-opacity duration-700 " +
          className
        }
        {...rest}
      />
    </div>
  );
}
