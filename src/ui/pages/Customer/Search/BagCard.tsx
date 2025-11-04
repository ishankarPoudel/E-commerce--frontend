import AddToCart from "@/ui/molecules/Buttons/AddToCart";
import { Badge } from "@/ui/shadcn/badge";
import { Card, CardContent } from "@/ui/shadcn/card";
import { getImageUrl } from "@/utils/urlHelpers";
import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import DetailProduct from "@/ui/organisms/products/DetailProduct";

interface BagProduct {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
  color?: string;
  image?: string;
  bagImages?: Array<{ image: string; altText?: string }>;
  inStock?: boolean;
  description?: string;
}

interface BagCardProps {
  product: BagProduct;
  variant?: "default" | "compact" | "horizontal";
  showWishlist?: boolean;
  showCategory?: boolean;
  showBrand?: boolean;
  className?: string;
}

export function BagCard({
  product,
  variant = "default",
  showWishlist = true,
  showCategory = true,
  showBrand = true,
  className,
}: BagCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Normalize image handling for both data formats
  const getProductImage = () => {
    if (product.image) return product.image;
    if (product.bagImages && product.bagImages.length > 0) {
      return product.bagImages[0].image;
    }
    return "/placeholder.svg?height=200&width=200";
  };

  const getAltText = () => {
    if (
      product.bagImages &&
      product.bagImages.length > 0 &&
      product.bagImages[0].altText
    ) {
      return product.bagImages[0].altText;
    }
    return product.name;
  };

  // Variant-specific styles
  const getCardStyles = () => {
    switch (variant) {
      case "compact":
        return "w-52 flex-shrink-0";
      case "horizontal":
        return "w-full";
      default:
        return "max-w-sm";
    }
  };

  const getImageStyles = () => {
    switch (variant) {
      case "compact":
        return "aspect-[4/3] h-40";
      case "horizontal":
        return "aspect-square";
      default:
        return "aspect-[3/4]";
    }
  };

  const getPaddingStyles = () => {
    switch (variant) {
      case "compact":
        return "p-3 space-y-2";
      default:
        return "p-3 space-y-2";
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open detail if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.tagName === "BUTTON" ||
      target.closest('[role="button"]')
    ) {
      return;
    }
    setShowDetailDialog(true);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <>
      <Card
        className={cn(
          "group cursor-pointer overflow-hidden border border-border/50 bg-card hover:border-border transition-all duration-300 hover:shadow-lg",
          variant === "compact" && "rounded-2xl",
          getCardStyles(),
          className
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          {/* Image Container */}
          <div
            className={cn(
              "relative overflow-hidden bg-muted/30",
              getImageStyles()
            )}
          >
            <img
              src={getImageUrl(getProductImage())}
              alt={getAltText()}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg?height=200&width=200";
              }}
            />

            {/* Wishlist Button */}
            {showWishlist && (
              <button
                className={cn(
                  "absolute top-3 left-3 h-8 w-8 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200 flex items-center justify-center",
                  "opacity-0 group-hover:opacity-100",
                  isWishlisted
                    ? "bg-red-500/90 text-white hover:bg-red-600"
                    : "bg-white/80 text-gray-600 hover:bg-white"
                )}
                onClick={handleWishlistClick}
              >
                <Heart
                  className={cn("h-4 w-4", isWishlisted && "fill-current")}
                />
              </button>
            )}

            {/* Stock Overlay */}
            {product.inStock === false && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="secondary" className="bg-white/90 text-black">
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* Add to Cart Button */}
            <AddToCart bagId={product.id} />
          </div>

          {/* Product Info */}
          <div className={getPaddingStyles()}>
            {/* Brand & Category */}
            {(showBrand || showCategory) && (
              <div className="flex items-center justify-between">
                {showBrand && product.brand && (
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {product.brand}
                  </span>
                )}
                {showCategory && product.category && (
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                )}
              </div>
            )}

            {/* Product Name */}
            <h3 className="font-medium text-sm text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Price & Stock Status */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-baseline gap-1">
                <span className="text-base font-semibold text-foreground">
                  Rs {Math.floor(product.price)}
                </span>
                {product.price % 1 !== 0 && (
                  <span className="text-xs text-muted-foreground">
                    .{(product.price % 1).toFixed(2).substring(2)}
                  </span>
                )}
              </div>

              {/* Stock Indicator */}
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    product.inStock !== false ? "bg-green-500" : "bg-red-500"
                  )}
                />
                <span className="text-xs text-muted-foreground">
                  {product.inStock !== false ? "Available" : "Sold Out"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Product Dialog - Rendered conditionally */}
      {showDetailDialog && (
        <DetailProduct
          bagId={product.id}
          openWindow={showDetailDialog}
          onClose={() => setShowDetailDialog(false)}
        />
      )}
    </>
  );
}
