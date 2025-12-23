import { useState, useRef } from "react";
import { Badge } from "@/ui/shadcn/badge";
import { Image } from "@/ui/shadcn/image";
import { getImageUrl } from "@/utils/urlHelpers";
import { AddToCartButton } from "@/ui/molecules/Buttons/AddToCart";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  price: number;
  type: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes?: string[];
  isFeatured?: boolean;
  description: string;
  material: string;
  weightKg: number;
  capacityLiters?: number;
  brand: string;
  features: Record<string, boolean>;
  stock: number;
}

export interface ProductCardProps {
  product: Product;
  onClick: () => void;
  priority?: boolean;
}

function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    red: "#ef4444",
    yellow: "#eab308",
    green: "#22c55e",
    blue: "#3b82f6",
    black: "#1f2937",
    white: "#f9fafb",
    brown: "#92400e",
    gray: "#6b7280",
    grey: "#6b7280",
    pink: "#ec4899",
    purple: "#a855f7",
    orange: "#f97316",
    navy: "#1e3a8a",
    beige: "#d4b5a0",
    tan: "#d2b48c",
    cream: "#fffdd0",
    maroon: "#800000",
    olive: "#808000",
    teal: "#14b8a6",
    lavender: "#e9d5ff",
    coral: "#ff7f50",
    mint: "#98ff98",
    gold: "#ffd700",
    silver: "#c0c0c0",
  };
  return colorMap[colorName.toLowerCase()] || "#9ca3af";
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 200;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const producutImages = product?.images?.map((img) => {
    return typeof img === "string" ? img : (img as { image: string })?.image;
  });

  const handleCardClick = () => {
    onClick();
  };

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
        }
      }}
    >
      {/* Image Container - 4:5 aspect ratio */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-sm mb-3 transition-transform duration-300 group-hover:-translate-y-1">
        <Image
          src={getImageUrl(producutImages?.[0])}
          alt={product.name}
          fill={true}
          priority={true}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAYAAABWKLW/AAAAHUlEQVR42mP8z/CfAQgwMjBg+M/AwPCfgQHGBgYGAAAlJQdC1iNn3QAAAABJRU5ErkJggg=="
        />

        {/* Featured Badge */}
        {product.isFeatured && (
          <Badge
            className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1"
            aria-label="Featured product"
          >
            Featured
          </Badge>
        )}

        {/* Quick Add Button */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
          onClick={(e) => e.stopPropagation()}
        >
          <AddToCartButton
            product={product}
            variant="outline"
            size="sm"
            fullWidth
            showQuantity
            className="bg-card/95 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground border-border shadow-lg"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm leading-snug line-clamp-2 text-balance">
            {product.name}
          </h3>
          <span className="font-semibold text-sm whitespace-nowrap">
            रू {product.price}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">{product.brand}</p>

        {/*  Clean Color Swatches - No Separator */}
        {product?.colors && product?.colors?.length > 0 && (
          <div
            className="flex items-center gap-1.5 mt-1"
            role="list"
            aria-label="Available colors"
            onClick={(e) => e.stopPropagation()}
          >
            {product?.colors?.slice(0, 3)?.map((color, index) => {
              const colorName = typeof color === "string" ? color : color.name;
              const colorHex =
                typeof color === "string" ? getColorHex(color) : color.hex;

              const isHovered = hoveredColor === colorName;
              const isLight = isLightColor(colorHex);

              return (
                <button
                  key={colorName || index}
                  type="button"
                  className={cn(
                    "relative w-4 h-4 rounded-full transition-all duration-200",
                    "hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                    "cursor-pointer group/color",
                    isHovered ? "scale-110" : "scale-100"
                  )}
                  style={{
                    backgroundColor: colorHex,
                  }}
                  role="listitem"
                  aria-label={colorName}
                  onMouseEnter={() => setHoveredColor(colorName)}
                  onMouseLeave={() => setHoveredColor(null)}
                >
                  {/* Subtle Ring */}
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full transition-all duration-200",
                      isHovered
                        ? "ring-2 ring-foreground/40 ring-offset-1 ring-offset-background"
                        : "ring-1 ring-black/5"
                    )}
                    aria-hidden="true"
                  />

                  {/* Border for Light Colors */}
                  {isLight && (
                    <span
                      className="absolute inset-0 rounded-full ring-1 ring-inset ring-border/60"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}

            {/* More Colors Text */}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-muted-foreground font-medium ml-1">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-[4/5] bg-muted rounded-sm mb-3" />
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-5 h-5 bg-muted rounded-full" />
          <div className="w-5 h-5 bg-muted rounded-full" />
          <div className="w-5 h-5 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}
