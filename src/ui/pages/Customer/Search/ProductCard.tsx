import type React from "react";
import { useState, useRef } from "react";
import { Badge } from "@/ui/shadcn/badge";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import { Image } from "@/ui/shadcn/image";
import { getImageUrl } from "@/utils/urlHelpers";
import { AddToCartButton } from "@/ui/molecules/Buttons/AddToCart";

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

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0]
  );
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const { addItem } = useCart();

  const producutImages = product.images.map((img) => {
    return img;
  });
  console.log("Product :", product);

  const handleCardClick = () => {
    onClick();
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (product.stock === 0) {
      toast.error("This item is currently unavailable");
      return;
    }

    setIsAdding(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    addItem({
      productId: product.id,
      quantity: 1,
      color: product.colors[0].name,
      size: selectedSize,
    });

    setIsAdding(false);
    setShowSuccess(true);

    toast.success(`${product.name} has been added to your cart`);

    setTimeout(() => setShowSuccess(false), 2000);
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
          src={getImageUrl(producutImages[0])}
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
            ${product.price}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">{product.type}</p>

        {/* Color Swatches */}
        {product.colors.length > 0 && (
          <div
            className="flex items-center gap-1.5 mt-0.5"
            role="list"
            aria-label="Available colors"
          >
            {product.colors.slice(0, 3).map((color) => (
              <div
                key={color.name}
                className="w-4 h-4 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: color.hex }}
                role="listitem"
                aria-label={color.name}
                title={color.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-muted-foreground">
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
        <div className="flex gap-1.5 mt-0.5">
          <div className="w-4 h-4 bg-muted rounded-full" />
          <div className="w-4 h-4 bg-muted rounded-full" />
          <div className="w-4 h-4 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}
