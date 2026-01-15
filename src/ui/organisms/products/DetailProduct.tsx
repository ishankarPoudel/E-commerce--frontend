import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import AddToCartButton from "@/ui/molecules/Buttons/AddToCart";
import { Product } from "@/ui/pages/Customer/Search/ProductCard";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Image } from "@/ui/shadcn/image";
import { ScrollArea } from "@/ui/shadcn/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/select";
import { getImageUrl } from "@/utils/urlHelpers";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplet,
  Maximize2,
  Package,
  Ruler,
  Shield,
  Tag,
  Truck,
  Weight,
  X,
  ZoomIn,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ProductDetailPanelProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const featureIcons: Record<string, any> = {
  waterproof: Droplet,
  waterResistant: Droplet,
  laptopCompartment: Package,
  usbCharging: Package,
  antiTheft: Shield,
  warranty: Award,
  freeShipping: Truck,
  quickDry: Clock,
  ergonomic: Package,
  expandable: Ruler,
};

function getProductImageUrl(image: any): string {
  if (!image) return "/placeholder.svg";

  if (typeof image === "string") {
    return getImageUrl(image) || "/placeholder.svg";
  }

  if (image.image) {
    return getImageUrl(image.image) || "/placeholder.svg";
  }

  return "/placeholder.svg";
}

export function ProductDetailPanel({
  product,
  isOpen,
  onClose,
}: ProductDetailPanelProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const getFirstColor = () => {
    if (!product?.colors || product.colors.length === 0) return "";
    const firstColor = product.colors[0];
    return typeof firstColor === "string" ? firstColor : firstColor?.name || "";
  };

  const [selectedColor, setSelectedColor] = useState(getFirstColor());
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    setSelectedImage(0);
    setSelectedColor(getFirstColor());
    setSelectedSize(product?.sizes?.[0] || "");
    setIsZoomed(false);
    setIsFullscreen(false);
  }, [product]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !product?.images) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && selectedImage > 0) {
        setSelectedImage((prev) => prev - 1);
      } else if (
        e.key === "ArrowRight" &&
        selectedImage < product.images.length - 1
      ) {
        setSelectedImage((prev) => prev + 1);
      } else if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedImage, product, isFullscreen, onClose]);

  const trueFeatures = product?.features
    ? Object.entries(product.features)
        .filter(([, value]) => value)
        .map(([key]) => key)
    : [];

  if (!isOpen || !product) return null;

  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ✅ SHEET - Smaller widths for large screens */}
      <div
        className="fixed inset-0 
                   md:inset-y-0 md:right-0 md:left-auto
                   md:w-[450px] lg:w-[500px] xl:w-[550px]
                   z-50 
                   bg-card 
                   md:border-l border-border 
                   overflow-hidden shadow-2xl
                   animate-in slide-in-from-bottom md:slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
      >
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 md:top-3 md:right-3 z-20 
                     bg-background/80 backdrop-blur-sm hover:bg-accent 
                     rounded-full h-8 w-8 md:h-9 md:w-9
                     shadow-lg"
          aria-label="Close product details"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* ✅ Scrollable Container - Compact spacing */}
        <ScrollArea className="h-full">
          <div className="flex flex-col">
            {/* ✅ Gallery Section - Smaller image */}
            <div className="w-full bg-muted/30">
              {/* Main Image Container */}
              <div className="relative aspect-square bg-muted">
                <Image
                  src={getProductImageUrl(product.images?.[selectedImage])}
                  alt={`${product.name} - Image ${selectedImage + 1}`}
                  fill
                  className={cn(
                    "object-contain p-4 md:p-6 lg:p-8 transition-transform duration-300",
                    isZoomed && "scale-150 cursor-zoom-out"
                  )}
                  onClick={() => setIsZoomed(!isZoomed)}
                  sizes="(max-width: 768px) 100vw, 550px"
                  priority
                />

                {/* Image Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <Button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev > 0 ? prev - 1 : product.images.length - 1
                        )
                      }
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 
                                 bg-background/80 backdrop-blur-sm hover:bg-accent 
                                 rounded-full h-7 w-7 md:h-8 md:w-8 shadow-lg"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                      onClick={() =>
                        setSelectedImage((prev) =>
                          prev < product.images.length - 1 ? prev + 1 : 0
                        )
                      }
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 
                                 bg-background/80 backdrop-blur-sm hover:bg-accent 
                                 rounded-full h-7 w-7 md:h-8 md:w-8 shadow-lg"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 
                                  px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm 
                                  text-[10px] md:text-xs font-medium shadow-sm"
                  >
                    {selectedImage + 1} / {product.images.length}
                  </div>
                )}

                {/* Image Controls */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 flex gap-1.5">
                  <Button
                    onClick={() => setIsZoomed(!isZoomed)}
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm hover:bg-accent 
                               rounded-full h-7 w-7 md:h-8 md:w-8 shadow-lg"
                    aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    onClick={() => setIsFullscreen(true)}
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 backdrop-blur-sm hover:bg-accent 
                               rounded-full h-7 w-7 md:h-8 md:w-8 shadow-lg"
                    aria-label="View fullscreen"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {product.isFeatured && (
                  <Badge
                    className="absolute top-2 right-10 md:top-3 md:right-12 
                                    bg-primary text-primary-foreground text-[10px]"
                  >
                    Featured
                  </Badge>
                )}
              </div>

              {/* ✅ Thumbnail Gallery - Smaller thumbnails */}
              {hasMultipleImages && (
                <div className="border-t border-border bg-card">
                  <ScrollArea className="w-full">
                    <div className="flex gap-1.5 md:gap-2 p-2 md:p-3">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={cn(
                            "relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-all",
                            selectedImage === index
                              ? "border-primary ring-2 ring-primary ring-offset-2"
                              : "border-border hover:border-accent"
                          )}
                          aria-label={`View image ${index + 1}`}
                          aria-pressed={selectedImage === index}
                        >
                          <Image
                            src={getProductImageUrl(image)}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>

            {/* ✅ Details Section - Compact spacing */}
            <div className="w-full">
              <div className="p-3 md:p-4 lg:p-5 space-y-3 md:space-y-4">
                {/* Header - Smaller fonts */}
                <div>
                  <h1
                    id="product-title"
                    className="text-lg sm:text-xl md:text-xl font-semibold mb-1.5 text-balance pr-8 leading-tight"
                  >
                    {product.name}
                  </h1>
                  <p className="text-[11px] sm:text-xs md:text-xs text-muted-foreground mb-1.5">
                    {product.brand || product.type || "Product"}
                  </p>
                  <div className="text-xl sm:text-2xl md:text-2xl font-bold text-primary">
                    रू {product.price.toLocaleString()}
                  </div>
                </div>

                {/* ✅ Selection Options - Compact */}
                <div className="bg-muted/50 border border-border rounded-lg p-2.5 md:p-3 space-y-2.5 md:space-y-3">
                  {/* Color Selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <label className="text-[11px] sm:text-xs md:text-xs font-medium mb-1.5 block">
                        Color:{" "}
                        <span className="text-muted-foreground capitalize font-normal">
                          {selectedColor}
                        </span>
                      </label>
                      <div
                        className="flex gap-1.5 flex-wrap"
                        role="radiogroup"
                        aria-label="Select color"
                      >
                        {product.colors.map((color) => {
                          const colorName =
                            typeof color === "string" ? color : color.name;
                          const colorHex =
                            typeof color === "string"
                              ? getColorHex(color)
                              : color.hex;

                          return (
                            <button
                              key={colorName}
                              onClick={() => setSelectedColor(colorName)}
                              className={cn(
                                "w-8 h-8 sm:w-9 sm:h-9 md:w-9 md:h-9 rounded-full border-2 transition-all",
                                selectedColor === colorName
                                  ? "border-primary ring-2 ring-primary ring-offset-2 scale-110"
                                  : "border-border hover:border-accent hover:scale-105"
                              )}
                              style={{ backgroundColor: colorHex }}
                              aria-label={colorName}
                              role="radio"
                              aria-checked={selectedColor === colorName}
                              title={colorName}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <label
                        htmlFor="size-select"
                        className="text-[11px] sm:text-xs md:text-xs font-medium mb-1.5 block"
                      >
                        Size
                      </label>
                      <Select
                        value={selectedSize}
                        onValueChange={setSelectedSize}
                      >
                        <SelectTrigger
                          id="size-select"
                          className="h-9 sm:h-10 md:h-10 text-xs"
                          aria-label="Select size"
                        >
                          <SelectValue placeholder="Select a size" />
                        </SelectTrigger>
                        <SelectContent>
                          {product.sizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <AddToCartButton
                    variant="minimal"
                    product={product}
                    fullWidth
                    showQuantity
                    defaultColor={selectedColor}
                    defaultSize={selectedSize}
                    className="h-10 sm:h-11 md:h-11 text-xs sm:text-sm md:text-sm font-semibold"
                  />
                </div>

                {/* Description - Smaller text */}
                {product.description && (
                  <div>
                    <h2 className="text-sm sm:text-base md:text-base font-semibold mb-1.5">
                      Description
                    </h2>
                    <p className="text-[11px] sm:text-xs md:text-xs text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Specifications - Compact grid */}
                <div>
                  <h2 className="text-sm sm:text-base md:text-base font-semibold mb-2">
                    Specifications
                  </h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-2">
                    {product.material && (
                      <div className="flex items-start gap-2 p-2 md:p-2.5 rounded-lg bg-muted/50 border border-border">
                        <Tag
                          className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <dt className="text-[11px] sm:text-xs md:text-xs font-medium">
                            Material
                          </dt>
                          <dd className="text-[10px] sm:text-[11px] md:text-[11px] text-muted-foreground truncate">
                            {product.material}
                          </dd>
                        </div>
                      </div>
                    )}
                    {product.weightKg && (
                      <div className="flex items-start gap-2 p-2 md:p-2.5 rounded-lg bg-muted/50 border border-border">
                        <Weight
                          className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <dt className="text-[11px] sm:text-xs md:text-xs font-medium">
                            Weight
                          </dt>
                          <dd className="text-[10px] sm:text-[11px] md:text-[11px] text-muted-foreground">
                            {product.weightKg} kg
                          </dd>
                        </div>
                      </div>
                    )}
                    {product.capacityLiters && (
                      <div className="flex items-start gap-2 p-2 md:p-2.5 rounded-lg bg-muted/50 border border-border">
                        <Ruler
                          className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <dt className="text-[11px] sm:text-xs md:text-xs font-medium">
                            Capacity
                          </dt>
                          <dd className="text-[10px] sm:text-[11px] md:text-[11px] text-muted-foreground">
                            {product.capacityLiters}L
                          </dd>
                        </div>
                      </div>
                    )}
                    {product.type && (
                      <div className="flex items-start gap-2 p-2 md:p-2.5 rounded-lg bg-muted/50 border border-border">
                        <Package
                          className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <dt className="text-[11px] sm:text-xs md:text-xs font-medium">
                            Type
                          </dt>
                          <dd className="text-[10px] sm:text-[11px] md:text-[11px] text-muted-foreground truncate">
                            {product.type}
                          </dd>
                        </div>
                      </div>
                    )}
                    {product.brand && (
                      <div className="flex items-start gap-2 p-2 md:p-2.5 rounded-lg bg-muted/50 border border-border">
                        <Award
                          className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <dt className="text-[11px] sm:text-xs md:text-xs font-medium">
                            Brand
                          </dt>
                          <dd className="text-[10px] sm:text-[11px] md:text-[11px] text-muted-foreground truncate">
                            {product.brand}
                          </dd>
                        </div>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Features - Compact */}
                {trueFeatures.length > 0 && (
                  <div className="pb-3">
                    <h2 className="text-sm sm:text-base md:text-base font-semibold mb-2">
                      Features
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-2">
                      {trueFeatures.map((feature) => {
                        const Icon = featureIcons[feature] || Package;
                        const displayName = feature
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())
                          .trim();

                        return (
                          <div
                            key={feature}
                            className="flex items-center gap-2 p-2 md:p-2.5 rounded-lg bg-muted/50 border border-border"
                          >
                            <Icon
                              className="h-3.5 w-3.5 text-primary flex-shrink-0"
                              aria-hidden="true"
                            />
                            <span className="text-[11px] sm:text-xs md:text-xs font-medium">
                              {displayName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md"
            onClick={() => setIsFullscreen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <Button
              onClick={() => setIsFullscreen(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm 
                         hover:bg-accent rounded-full h-10 w-10 md:h-12 md:w-12 shadow-lg"
              aria-label="Close fullscreen"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </Button>

            {hasMultipleImages && (
              <>
                <Button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev > 0 ? prev - 1 : product.images.length - 1
                    )
                  }
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 
                             bg-background/80 backdrop-blur-sm hover:bg-accent 
                             rounded-full h-10 w-10 md:h-12 md:w-12 shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                </Button>

                <Button
                  onClick={() =>
                    setSelectedImage((prev) =>
                      prev < product.images.length - 1 ? prev + 1 : 0
                    )
                  }
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 
                             bg-background/80 backdrop-blur-sm hover:bg-accent 
                             rounded-full h-10 w-10 md:h-12 md:w-12 shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                </Button>

                <div
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 
                                px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm 
                                text-sm font-medium shadow-lg"
                >
                  {selectedImage + 1} / {product.images.length}
                </div>
              </>
            )}

            <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
              <Image
                src={getProductImageUrl(product.images?.[selectedImage])}
                alt={`${product.name} - Fullscreen`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </>
      )}
    </>
  );
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

export default ProductDetailPanel;
