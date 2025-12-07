import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import AddToCartButton from "@/ui/molecules/Buttons/AddToCart";
import { Product } from "@/ui/pages/Customer/Search/ProductCard";
import { Badge } from "@/ui/shadcn/badge";
import { Image } from "@/ui/shadcn/image";
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

  // If it's a string, use it directly
  if (typeof image === "string") {
    return getImageUrl(image) || "/placeholder.svg";
  }

  // If it's an object with 'image' property
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

  const { addItem } = useCart();

  // Reset state when product changes
  useEffect(() => {
    setSelectedImage(0);
    setSelectedColor(getFirstColor());
    setSelectedSize(product?.sizes?.[0] || "");
  }, [product]);

  const trueFeatures = product?.features
    ? Object.entries(product.features)
        .filter(([, value]) => value)
        .map(([key]) => key)
    : [];

  if (!isOpen || !product) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full md:w-[600px] lg:w-[800px] bg-card border-l border-border overflow-y-auto animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-10 p-2 rounded-sm bg-card/80 backdrop-blur-sm hover:bg-accent transition-colors border border-border"
          aria-label="Close product details"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
          {/* Gallery Section */}
          <div className="lg:w-1/2 sticky top-0 bg-muted/30">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted">
              <Image
                src={getProductImageUrl(product.images?.[selectedImage])}
                alt={`${product.name} - Image ${selectedImage + 1}`}
                fill
                className={cn(
                  "object-cover transition-transform duration-300",
                  isZoomed && "scale-150 cursor-zoom-out"
                )}
                onClick={() => setIsZoomed(!isZoomed)}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />

              {/* Image Controls */}
              <div className="absolute top-4 left-4 flex gap-2">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="p-2 rounded-sm bg-card/80 backdrop-blur-sm hover:bg-accent transition-colors border border-border"
                  aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-sm bg-card/80 backdrop-blur-sm hover:bg-accent transition-colors border border-border"
                  aria-label="View fullscreen"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              {product.isFeatured && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  Featured
                </Badge>
              )}
            </div>

            {product.images && product.images.length > 0 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all",
                      selectedImage === index
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-border hover:border-accent"
                    )}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={selectedImage === index}
                  >
                    <Image
                      key={`main-image-${selectedImage}`}
                      src={getProductImageUrl(image)}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col">
            <div className="flex-1">
              <h1
                id="product-title"
                className="text-3xl font-semibold mb-2 text-balance"
              >
                {product.name}
              </h1>
              <p className="text-sm text-muted-foreground mb-4">
                {product.type || "Product"}
              </p>
              <div className="text-2xl font-bold mb-6">${product.price}</div>

              <div className="sticky top-0 bg-card/95 backdrop-blur-sm border border-border rounded-sm p-4 mb-6 space-y-4 z-10">
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Color:{" "}
                      <span className="text-muted-foreground capitalize">
                        {selectedColor}
                      </span>
                    </label>
                    <div
                      className="flex gap-2 flex-wrap"
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
                              "w-10 h-10 rounded-full border-2 transition-all capitalize",
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

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <label
                      htmlFor="size-select"
                      className="text-sm font-medium mb-2 block"
                    >
                      Size
                    </label>
                    <Select
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                    >
                      <SelectTrigger id="size-select" aria-label="Select size">
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

                <AddToCartButton
                  variant="minimal"
                  product={product}
                  fullWidth
                  showQuantity
                  defaultColor={selectedColor}
                  defaultSize={selectedSize}
                  className="h-12"
                />
              </div>

              {/* Description and specs sections */}
              {product.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Specifications</h2>
                <dl className="grid grid-cols-1 gap-3">
                  {product.material && (
                    <div className="flex items-start gap-3 p-3 rounded-sm bg-muted/50">
                      <Tag
                        className="h-5 w-5 text-muted-foreground mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-sm font-medium">Material</dt>
                        <dd className="text-sm text-muted-foreground">
                          {product.material}
                        </dd>
                      </div>
                    </div>
                  )}
                  {product.weightKg && (
                    <div className="flex items-start gap-3 p-3 rounded-sm bg-muted/50">
                      <Weight
                        className="h-5 w-5 text-muted-foreground mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-sm font-medium">Weight</dt>
                        <dd className="text-sm text-muted-foreground">
                          {product.weightKg} kg
                        </dd>
                      </div>
                    </div>
                  )}
                  {product.capacityLiters && (
                    <div className="flex items-start gap-3 p-3 rounded-sm bg-muted/50">
                      <Ruler
                        className="h-5 w-5 text-muted-foreground mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-sm font-medium">Capacity</dt>
                        <dd className="text-sm text-muted-foreground">
                          {product.capacityLiters}L
                        </dd>
                      </div>
                    </div>
                  )}
                  {product.type && (
                    <div className="flex items-start gap-3 p-3 rounded-sm bg-muted/50">
                      <Package
                        className="h-5 w-5 text-muted-foreground mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-sm font-medium">Type</dt>
                        <dd className="text-sm text-muted-foreground">
                          {product.type}
                        </dd>
                      </div>
                    </div>
                  )}
                  {product.brand && (
                    <div className="flex items-start gap-3 p-3 rounded-sm bg-muted/50">
                      <Award
                        className="h-5 w-5 text-muted-foreground mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-sm font-medium">Brand</dt>
                        <dd className="text-sm text-muted-foreground">
                          {product.brand}
                        </dd>
                      </div>
                    </div>
                  )}
                </dl>
              </div>

              {trueFeatures.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-3">Features</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {trueFeatures.map((feature) => {
                      const Icon = featureIcons[feature] || Package;
                      const displayName = feature
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                        .trim();

                      return (
                        <div
                          key={feature}
                          className="flex items-center gap-2 p-3 rounded-sm bg-muted/50"
                        >
                          <Icon
                            className="h-5 w-5 text-muted-foreground flex-shrink-0"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium">
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
      </div>

      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[60] bg-background flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 rounded-sm bg-card/80 backdrop-blur-sm hover:bg-accent transition-colors border border-border"
            aria-label="Close fullscreen"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <Image
              src={getProductImageUrl(product.images?.[selectedImage])}
              alt={`${product.name} - Fullscreen`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  );
}

// function to map color names to hex codes
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
    pink: "#ec4899",
    purple: "#a855f7",
    orange: "#f97316",
    navy: "#1e3a8a",
    beige: "#d4b5a0",
    tan: "#d2b48c",
  };
  return colorMap[colorName.toLowerCase()] || "#9ca3af";
}

export default ProductDetailPanel;
