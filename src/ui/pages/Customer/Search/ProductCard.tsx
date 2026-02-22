import { useState, useRef } from "react";
import { Badge } from "@/ui/shadcn/badge";
import { Image } from "@/ui/shadcn/image";
import { AddToCartButton } from "@/ui/molecules/Buttons/AddToCart";
import { cn } from "@/lib/utils";
import { getColorHex } from "@/ui/organisms/products/DetailProduct";
import { MediaEntity } from "@/api";

export interface Product {
  categories: any;
  id: string;
  name: string;
  price: number;
  type: string;
  images: MediaEntity[];
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

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 200;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const firstImageUrl = product.images[0]?.url || "";

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col cursor-pointer w-full group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name}`}
    >
      <div
        className={cn(
          "relative aspect-[3/4] overflow-hidden bg-muted rounded-md mb-1.5 sm:mb-2",
          "transition-transform duration-300 will-change-transform",
          isHovered && "md:-translate-y-1",
        )}
      >
        <Image
          src={firstImageUrl}
          alt={product.name}
          fill
          priority
          className={cn(
            "object-cover transition-transform duration-500",
            isHovered && "md:scale-105",
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {product.isFeatured && (
          <Badge className="absolute top-1.5 left-1.5 text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2">
            Featured
          </Badge>
        )}

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-1.5 sm:p-2 md:p-2.5 transition-all duration-300",

            "opacity-100 translate-y-0",

            isHovered
              ? "md:opacity-100 md:translate-y-0"
              : "md:opacity-0 md:translate-y-2",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <AddToCartButton
            product={product}
            size="sm"
            fullWidth
            showQuantity
            className="
              bg-card/95 backdrop-blur-sm
              border border-border shadow-sm
              hover:bg-primary hover:text-primary-foreground
              transition-colors duration-200
              h-7 sm:h-8 text-[10px] sm:text-xs
            "
          />
        </div>
      </div>

      <div className="flex flex-col gap-0.5 sm:gap-1 px-0.5">
        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
          <h3 className="text-[11px] sm:text-xs md:text-sm font-medium leading-tight line-clamp-2 flex-1">
            {product.name}
          </h3>

          <span className="text-[11px] sm:text-xs md:text-sm font-semibold whitespace-nowrap shrink-0">
            रु {product.price}
          </span>
        </div>

        <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground truncate">
          {product.brand}
        </p>

        {product.colors?.length > 0 && (
          <div
            className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1"
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
                  className="relative w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full transition-transform hover:scale-110"
                  style={{ backgroundColor: colorHex }}
                  title={colorName}
                >
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full",
                      isLight ? "ring-1 ring-border" : "ring-1 ring-black/10",
                    )}
                  />
                </span>
              );
            })}

            {product.colors.length > 3 && (
              <span className="text-[9px] sm:text-[10px] text-muted-foreground ml-0.5">
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
      <div className="aspect-[3/4] bg-muted rounded-md mb-2" />
      <div className="flex flex-col gap-1.5 px-0.5">
        <div className="h-3 sm:h-4 bg-muted rounded w-3/4" />
        <div className="h-2.5 sm:h-3 bg-muted rounded w-1/2" />
        <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-muted rounded-full" />
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-muted rounded-full" />
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}
