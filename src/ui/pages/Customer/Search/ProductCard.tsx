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
  stock?: number;
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

  const productImages = product?.images?.map((img) =>
    typeof img === "string" ? img : (img as { image: string })?.image
  );

  return (
    <div
      ref={cardRef}
      className="
        group relative flex flex-col cursor-pointer
        w-full
      "
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name}`}
    >
      {/* IMAGE */}
      <div
        className="
          relative aspect-[4/5] overflow-hidden bg-muted
          rounded-sm mb-2 sm:mb-3
          md:transition-transform md:duration-300 md:group-hover:-translate-y-1
        "
      >
        <Image
          src={getImageUrl(productImages?.[0])}
          alt={product.name}
          fill
          priority
          className="
            object-cover
            md:transition-transform md:duration-500
            md:group-hover:scale-105
          "
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* FEATURED */}
        {product.isFeatured && (
          <Badge className="absolute top-2 left-2 text-[10px] px-2 py-0.5">
            Featured
          </Badge>
        )}

        {/* ADD TO CART */}
        <div
          className="
            absolute inset-x-0 bottom-0 p-2 sm:p-3
            md:opacity-0 md:translate-y-2
            md:group-hover:opacity-100 md:group-hover:translate-y-0
            transition-all
          "
          onClick={(e) => e.stopPropagation()}
        >
          <AddToCartButton
            product={product}
            size="sm"
            fullWidth
            showQuantity
            className="
              bg-card/95 backdrop-blur
              border-border shadow
              hover:bg-primary hover:text-primary-foreground
            "
          />
        </div>
      </div>

      {/* INFO */}
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="
              text-xs sm:text-sm font-medium
              leading-snug line-clamp-2
            "
          >
            {product.name}
          </h3>

          <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
            रू {product.price}
          </span>
        </div>

        <p className="text-[10px] sm:text-xs text-muted-foreground">
          {product.brand}
        </p>

        {/* COLORS */}
        {product.colors?.length > 0 && (
          <div
            className="flex items-center gap-1.5 mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            {product.colors.slice(0, 3).map((color, index) => {
              const colorName = typeof color === "string" ? color : color.name;
              const colorHex =
                typeof color === "string" ? getColorHex(color) : color.hex;

              const isLight = isLightColor(colorHex);

              return (
                <span
                  key={colorName || index}
                  className="
                    relative w-3.5 h-3.5 sm:w-4 sm:h-4
                    rounded-full
                  "
                  style={{ backgroundColor: colorHex }}
                >
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full",
                      isLight ? "ring-1 ring-border" : "ring-1 ring-black/10"
                    )}
                  />
                </span>
              );
            })}

            {product.colors.length > 3 && (
              <span className="text-[10px] text-muted-foreground ml-1">
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
