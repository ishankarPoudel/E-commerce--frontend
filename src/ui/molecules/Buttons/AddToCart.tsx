import { addToCartMutation } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/ui/shadcn/button";
import { Badge } from "@/ui/shadcn/badge";
import { useMutation } from "@tanstack/react-query";
import { Plus, Minus, ShoppingCart, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const AddToCart = ({ bagId }: { bagId: string }) => {
  const { mutate: addToCart, isPending } = useMutation({
    ...addToCartMutation(),
  });

  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddClick = () => {
    if (!expanded) {
      setExpanded(true);
    } else {
      setQuantity((q) => q + 1);
      addToCart({
        body: { bagId: bagId, quantity: quantity + 1 },
      });
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
      addToCart({
        body: { bagId: bagId, quantity: quantity - 1 },
      });
    } else {
      setExpanded(false);
      setQuantity(1);
    }
  };

  return (
    <div className="absolute top-3 right-3 z-10">
      <div
        className={cn(
          "flex items-center backdrop-blur-sm bg-black/20 dark:bg-white/20 border border-white/30 dark:border-black/30 rounded-full shadow-lg transition-all duration-500 ease-out",
          expanded ? "w-32" : "w-auto"
        )}
      >
        {expanded ? (
          <div className="flex items-center w-full">
            {/* Decrease Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-red-500/20 hover:text-white transition-colors text-white/90"
              onClick={handleDecrease}
              disabled={isPending}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>

            {/* Quantity Display */}
            <div className="flex-1 flex items-center justify-center">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin text-white/80" />
              ) : (
                <Badge
                  variant="secondary"
                  className="h-6 min-w-6 rounded-full bg-white/20 text-white border-0 text-xs font-semibold backdrop-blur-sm"
                >
                  {quantity}
                </Badge>
              )}
            </div>

            {/* Increase Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-white/20 hover:text-white transition-colors text-white/90"
              onClick={handleAddClick}
              disabled={isPending}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAddClick}
            size="sm"
            disabled={isPending}
            className={cn(
              " h-10 px-4 rounded-full bg-black/30 hover:bg-black/40 text-white shadow-lg backdrop-blur-sm border border-white/20",
              "transition-all duration-300 hover:scale-105 active:scale-95",
              "flex items-center gap-2 font-medium text-sm"
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Adding...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddToCart;
