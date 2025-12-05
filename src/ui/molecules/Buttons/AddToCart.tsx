import type React from "react";
import { useState } from "react";

import { ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { Button } from "@/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/shadcn/dialog";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { getImageUrl } from "@/utils/urlHelpers";

interface Product {
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
    defaultColor || product.colors[0]?.name
  );
  const [selectedSize, setSelectedSize] = useState(
    defaultSize || product.sizes?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { addItem } = useCart();
  const needsOptions =
    (product.sizes && product.sizes.length > 1) ||
    (product.colors && product.colors.length > 1);

  // ✅ Add useEffect to debug quantity changes
  console.log("Current quantity:", quantity);

  const handleAddToCart = async (e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (product.stock === 0) {
      toast.error("This item is currently unavailable");
      return;
    }

    // If product has multiple options and not pre-selected, show modal
    if (needsOptions && !defaultColor && !defaultSize && !isModalOpen) {
      setIsModalOpen(true);
      return;
    }

    setIsAdding(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    addItem({
      productId: product.id,
      quantity: showQuantity ? quantity : 1,
      color: selectedColor,
      size: selectedSize,
    });

    setIsAdding(false);
    setShowSuccess(true);

    toast.success(
      `${showQuantity ? quantity : 1}x ${product.name} added to your cart`
    );

    setTimeout(() => {
      setShowSuccess(false);
      setIsModalOpen(false);
      setQuantity(1); // Reset quantity
    }, 1500);

    onSuccess?.();
  };

  const incrementQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Increment clicked - Before:", quantity);
    const newQty = Math.min(quantity + 1);
    console.log("Increment clicked - After:", newQty);
    setQuantity(newQty);
  };

  const decrementQuantity = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Decrement clicked - Before:", quantity);
    const newQty = Math.max(quantity - 1, 1);
    console.log("Decrement clicked - After:", newQty);
    setQuantity(newQty);
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

      {/* Quick Shop Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          console.log("Dialog open changed:", open);
          setIsModalOpen(open);
          // ✅ Reset quantity when closing
          if (!open) {
            setQuantity(1);
          }
        }}
        modal={true} // ✅ Ensure it's modal
      >
        <DialogContent
          className="sm:max-w-[500px] max-h-[90vh] overflow-hidden p-0 gap-0"
          onPointerDownOutside={(e) => e.preventDefault()} // ✅ Prevent accidental closes
          onInteractOutside={(e) => {
            // ✅ Only close on explicit outside click, not on internal interactions
            if (e.target instanceof Element && !e.target.closest("button")) {
              e.preventDefault();
            }
          }}
        >
          {/* Product Image Header */}
          <div className="relative w-full h-64 sm:h-80 bg-muted flex-shrink-0">
            <img
              src={getImageUrl(product.images[0])}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-20rem)]">
            <DialogHeader className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <DialogTitle className="text-xl font-semibold leading-tight">
                    {product.name}
                  </DialogTitle>
                  {product.brand && (
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                      {product.brand}
                    </DialogDescription>
                  )}
                </div>
                <div className="text-xl font-bold text-primary flex-shrink-0">
                  ${product.price}
                </div>
              </div>
            </DialogHeader>

            {/* Color Selection */}
            {product.colors && product.colors.length > 1 && (
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-foreground block">
                  Color:{" "}
                  <span className="text-primary font-semibold capitalize">
                    {selectedColor}
                  </span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColor(color.name);
                      }}
                      className={cn(
                        "relative w-12 h-12 rounded-full border-2 transition-all duration-200",
                        "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        selectedColor === color.name
                          ? "border-primary ring-2 ring-ring ring-offset-2 ring-offset-background scale-110 shadow-md"
                          : "border-border hover:border-primary/50"
                      )}
                      style={{ backgroundColor: color.hex }}
                      aria-label={`Select ${color.name} color`}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check
                            className="h-6 w-6 text-white drop-shadow-lg"
                            strokeWidth={3}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 1 && (
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-foreground block">
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
                        "px-5 py-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 uppercase",
                        "ring-2 ring-offset-2 ring-offset-background",
                        "hover:scale-105 focus-visible:outline-none focus-visible:ring-ring",
                        selectedSize === sizeOption
                          ? "bg-primary text-primary-foreground border-primary ring-ring shadow-md scale-105"
                          : "bg-card border-border text-foreground ring-transparent hover:border-primary/50 hover:bg-muted"
                      )}
                      aria-label={`Select size ${sizeOption}`}
                    >
                      {sizeOption}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            {showQuantity && (
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-foreground block">
                  Quantity: <strong>{quantity}</strong>{" "}
                  {/* ✅ Show quantity in label too */}
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border-2 border-border rounded-lg p-1 bg-card">
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className={cn(
                        "h-10 w-10 flex items-center justify-center",
                        "hover:bg-muted rounded-md transition-colors",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className={cn(
                        "h-10 w-10 flex items-center justify-center",
                        "hover:bg-muted rounded-md transition-colors",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.stock} in stock
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={isAdding || showSuccess || product.stock === 0}
              className={cn(
                "w-full h-12 text-base font-semibold shadow-sm",
                "btn-accent hover:shadow-md active:scale-[0.98] transition-all",
                showSuccess &&
                  "bg-success text-success-foreground hover:bg-success/90"
              )}
              size="lg"
              aria-label={`Add ${product.name} to cart`}
            >
              {showSuccess ? (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isAdding
                    ? "Adding..."
                    : `Add to Cart • $${(product.price * quantity).toFixed(2)}`}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddToCartButton;
