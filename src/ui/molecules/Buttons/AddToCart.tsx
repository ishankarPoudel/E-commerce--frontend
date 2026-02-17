import type React from "react";
import { useState } from "react";
import { ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { Button } from "@/ui/shadcn/button";
import { Dialog, DialogContent } from "@/ui/shadcn/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getImageUrl } from "@/utils/urlHelpers";
import { useMutation } from "@tanstack/react-query";
import { addToCartMutation } from "@/api/@tanstack/react-query.gen";
import { MediaEntity } from "@/api";
import { useAuth } from "@/context/authContext";
import { useNavigate } from "@tanstack/react-router";

interface Product {
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
interface AddToCartButtonProps {
  product: Product;
  variant?: "default" | "outline" | "ghost" | "minimal";
  size?: "sm" | "default" | "lg";
  className?: string;
  fullWidth?: boolean;
  showQuantity?: boolean;
  defaultColor?: string;
  defaultSize?: string;
  onSuccess?: () => void;
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
    pink: "#ec4899",
    purple: "#a855f7",
    orange: "#f97316",
    navy: "#1e3a8a",
    beige: "#d4b5a0",
    tan: "#d2b48c",
  };
  return colorMap[colorName.toLowerCase()] || "#9ca3af";
}

export function AddToCartButton({
  product,
  size = "default",
  className,
  fullWidth = false,
  showQuantity = true,
  defaultColor,
  defaultSize,
  onSuccess,
}: AddToCartButtonProps) {
  const [selectedColor, setSelectedColor] = useState(
    defaultColor || product?.colors?.[0]?.name,
  );
  const [selectedSize, setSelectedSize] = useState(
    defaultSize || product.sizes?.[0],
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // const { addItem } = useCart();
  const needsOptions =
    (product.sizes && product.sizes.length > 1) ||
    (product.colors && product.colors.length > 1);

  const { mutate: addToCart } = useMutation({
    ...addToCartMutation(),
  });

  const handleAddToCart = async (e?: React.MouseEvent) => {
    if (authLoading) {
      toast.loading("verifying authentication...");
      return;
    }
    if (!isAuthenticated) {
      (toast.info("Please log in to add items to your cart"),
        {
          action: {
            label: "LogIn",
            onClick: () => {
              navigate({
                to: "/auth/login",
              });
            },
          },
        });
      return;
    }
    e?.stopPropagation();
    if (product.stock === 0) {
      toast.error("This item is currently unavailable");
      return;
    }
    if (needsOptions && !defaultColor && !defaultSize && !isModalOpen) {
      setIsModalOpen(true);
      return;
    }
    setIsAdding(true);
    addToCart(
      {
        body: {
          bagId: product.id,
          quantity: showQuantity ? quantity : 1,
          color: selectedColor,
          size: selectedSize,
        },
      },
      {
        onSuccess: () => {
          setIsAdding(false);
          setShowSuccess(true);
          toast.success(
            `${showQuantity ? quantity : 1}x ${product.name} added to your cart`,
          );
          setTimeout(() => {
            setShowSuccess(false);
            setIsModalOpen(false);
            setQuantity(1);
          }, 1500);
          onSuccess?.();
        },
        onError: () => {
          setIsAdding(false);
          toast.error("Failed to add item to cart. Please try again.");
        },
      },
    );
  };

  const incrementQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setQuantity((prev) => Math.min(prev + 1));
  };

  const decrementQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
      <Button
        variant={"ghost"}
        size={size}
        className={cn(fullWidth && "w-full", className)}
        onClick={handleAddToCart}
        disabled={isAdding || product.stock === 0}
        aria-label={`Add ${product.name} to cart`}
      >
        {showSuccess ? (
          <>
            <Check className="mr-2 h-4 w-4" aria-hidden="true" />
            Added
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />
            {isAdding
              ? "Adding..."
              : product.stock === 0
                ? "Out of Stock"
                : "Add to Cart"}
          </>
        )}
      </Button>

      {/* Modern Quick Shop Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setQuantity(1);
        }}
        modal={true}
      >
        <DialogContent className="sm:max-w-[450px] p-0 gap-0 overflow-hidden">
          <div className="relative w-full h-56 bg-gradient-to-br from-muted/50 to-muted overflow-hidden group">
            <img
              src={getImageUrl(product?.images?.[0])}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="eager"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Featured Badge */}
            {product.isFeatured && (
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold rounded-full shadow-lg">
                Featured
              </div>
            )}
          </div>

          {/* Product Details with Card-like Design */}
          <div className="p-5 space-y-4 bg-gradient-to-b from-background to-muted/20">
            {/* Header Section */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold leading-tight line-clamp-2">
                {product.name}
              </h3>
              {product.brand && (
                <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                  {product.brand}
                </p>
              )}
            </div>

            <div className="h-px bg-border/50" />

            {/* Color Selection - Modern Pills */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground block">
                  Color:{" "}
                  <span className="text-foreground capitalize font-bold">
                    {selectedColor}
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
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
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedColor(colorName);
                        }}
                        className={cn(
                          "relative w-10 h-10 rounded-lg border-2 transition-all shadow-sm hover:shadow-md",
                          selectedColor === colorName
                            ? "border-primary ring-2 ring-primary/30 ring-offset-2 scale-110 shadow-lg"
                            : "border-border/50 hover:border-primary/50 hover:scale-105",
                        )}
                        style={{ backgroundColor: colorHex }}
                        aria-label={colorName}
                        title={colorName}
                      >
                        {selectedColor === colorName && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
                              <Check
                                className="h-3 w-3 text-primary"
                                strokeWidth={3}
                              />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection - Modern Chips */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground block">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sizeOption) => (
                    <button
                      key={sizeOption}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(sizeOption);
                      }}
                      className={cn(
                        "px-4 py-2 text-xs font-bold rounded-lg border-2 transition-all uppercase tracking-wide shadow-sm hover:shadow-md",
                        selectedSize === sizeOption
                          ? "bg-primary text-primary-foreground border-primary scale-105 shadow-md"
                          : "bg-background border-border hover:border-primary/50 hover:bg-muted/50",
                      )}
                    >
                      {sizeOption}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection - Modern Counter */}
            {showQuantity && (
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground block">
                  Quantity
                </label>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3 bg-background rounded-lg border border-border shadow-sm">
                    <button
                      type="button"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1 || authLoading}
                      className="h-9 w-9 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[2.5rem] text-center text-base font-bold tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={incrementQuantity}
                      disabled={
                        quantity >= (product.stock ?? Infinity) || authLoading
                      }
                      className="h-9 w-9 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modern Add to Cart Button with Animation */}
            <Button
              onClick={handleAddToCart}
              disabled={isAdding || showSuccess || product.stock === 0}
              className={cn(
                "w-full h-11 text-sm font-bold   transition-all duration-300",
                "bg-gradient-to-r from-primary to-primary/90 hover:cursor-pointer ",
                "",
                isAdding && "opacity-70 cursor-not-allowed",
                showSuccess && "hover:cursor-default",
                authLoading && "opacity-70 cursor-not-allowed",
              )}
            >
              {showSuccess ? (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <span>Added to Cart</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>
                    {isAdding
                      ? "Adding..."
                      : `Add to Cart • रु ${(product.price * quantity).toFixed(
                          2,
                        )}`}
                  </span>
                </div>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddToCartButton;
