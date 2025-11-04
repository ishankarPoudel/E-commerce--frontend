import { addToCartMutation } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/ui/shadcn/button";
import { useMutation } from "@tanstack/react-query";
import { Plus, Minus, ShoppingCart, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const AddToCart = ({
  bagId,
  className,
}: {
  bagId: string;
  className?: string;
}) => {
  const {
    mutate: addToCart,
    isPending,
    isSuccess,
  } = useMutation({
    ...addToCartMutation(),
  });

  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!expanded) {
      setExpanded(true);
      setQuantity(1);
    } else {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      addToCart({
        body: { bagId: bagId, quantity: newQuantity },
      });
    }
  };

  const handleDecrease = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      addToCart({
        body: { bagId: bagId, quantity: newQuantity },
      });
    } else {
      setExpanded(false);
      setQuantity(1);
    }
  };

  // Check if it's being used in detail view (full width mode)
  const isDetailView = className?.includes("w-full");

  return (
    <div
      className={cn(
        isDetailView ? "relative w-full" : "absolute top-3 right-3 z-10",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center transition-all duration-300 ease-in-out",
          expanded && !isDetailView ? "w-36" : "w-full"
        )}
      >
        {expanded ? (
          // Expanded State - Quantity Controls
          <div
            className={cn(
              "flex items-center gap-1 bg-white dark:bg-gray-900 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 p-1 backdrop-blur-md",
              isDetailView && "w-full justify-between px-4"
            )}
          >
            {/* Decrease Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-all duration-200",
                isDetailView ? "h-12 w-12" : "h-8 w-8",
                quantity === 1
                  ? "hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              onClick={handleDecrease}
              disabled={isPending}
            >
              <Minus className={isDetailView ? "h-5 w-5" : "h-3.5 w-3.5"} />
            </Button>

            {/* Quantity Display */}
            <div
              className={cn(
                "flex items-center justify-center",
                isDetailView ? "min-w-[80px]" : "flex-1 min-w-[40px]"
              )}
            >
              {isPending ? (
                <Loader2
                  className={cn(
                    "animate-spin text-primary",
                    isDetailView ? "h-6 w-6" : "h-4 w-4"
                  )}
                />
              ) : showSuccess ? (
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 animate-in zoom-in duration-200",
                    isDetailView ? "h-10 w-10" : "h-6 w-6"
                  )}
                >
                  <Check className={isDetailView ? "h-6 w-6" : "h-4 w-4"} />
                </div>
              ) : (
                <span
                  className={cn(
                    "font-semibold text-foreground tabular-nums",
                    isDetailView ? "text-xl" : "text-sm"
                  )}
                >
                  {quantity}
                </span>
              )}
            </div>

            {/* Increase Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200",
                isDetailView ? "h-12 w-12" : "h-8 w-8"
              )}
              onClick={handleAddClick}
              disabled={isPending}
            >
              <Plus className={isDetailView ? "h-5 w-5" : "h-3.5 w-3.5"} />
            </Button>
          </div>
        ) : (
          // Collapsed State - Add to Cart Button
          <Button
            onClick={handleAddClick}
            disabled={isPending}
            className={cn(
              "rounded-full shadow-lg",
              "bg-white dark:bg-gray-900 text-gray-900 dark:text-white",
              "border border-gray-200 dark:border-gray-700",
              "hover:bg-gray-50 dark:hover:bg-gray-800",
              "hover:shadow-xl hover:scale-105",
              "active:scale-95",
              "transition-all duration-200 ease-out",
              "backdrop-blur-md",
              "group",
              isDetailView ? "h-14 w-full text-lg px-8" : "h-9 w-auto px-4"
            )}
          >
            {isPending ? (
              <Loader2
                className={cn(
                  "animate-spin",
                  isDetailView ? "h-6 w-6" : "h-4 w-4"
                )}
              />
            ) : showSuccess ? (
              <div className="flex items-center gap-2">
                <Check
                  className={cn(
                    "text-green-600",
                    isDetailView ? "h-6 w-6" : "h-4 w-4"
                  )}
                />
                <span
                  className={cn(
                    "font-medium",
                    isDetailView ? "text-base" : "text-sm"
                  )}
                >
                  Added
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart
                  className={cn(
                    "transition-transform group-hover:scale-110",
                    isDetailView ? "h-6 w-6" : "h-4 w-4"
                  )}
                />
                <span
                  className={cn(
                    "font-medium",
                    isDetailView ? "text-base" : "text-sm"
                  )}
                >
                  Add to Cart
                </span>
              </div>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddToCart;
