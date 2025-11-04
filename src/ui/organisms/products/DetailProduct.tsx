import { getImageUrl } from "@/utils/urlHelpers";
import {
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getBagByIdOptions } from "@/api/@tanstack/react-query.gen";

import { Dialog, DialogContent } from "@/ui/shadcn/dialog";
import { Button } from "@/ui/shadcn/button";
import { Badge } from "@/ui/shadcn/badge";
import { useQuery } from "@tanstack/react-query";
import AddToCart from "@/ui/molecules/Buttons/AddToCart";

const DetailProduct = ({
  bagId,
  openWindow,
  onClose,
}: {
  bagId: string;
  openWindow: boolean;
  onClose: () => void;
}) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: bagData, isLoading } = useQuery({
    ...getBagByIdOptions({
      path: {
        id: bagId,
      },
    }),
    enabled: openWindow && !!bagId,
  });

  const bag = bagData?.data;
  const images = bag?.bagImages || [];

  const handleImageNavigation = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <Dialog open={openWindow} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] min-w-[75vw] max-h-[90vh] overflow-scroll p-0 border-0 rounded-2xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
              <p className="text-sm text-muted-foreground">
                Loading product...
              </p>
            </div>
          </div>
        ) : bag ? (
          <div className="grid md:grid-cols-2 gap-0 h-full bg-background">
            {/* Left Side - Image Gallery */}
            <div className="relative bg-gradient-to-br from-muted/20 to-muted/40 p-8 flex flex-col group">
              {/* Main Image */}
              <div className="relative flex-1 flex items-center justify-center mb-4">
                {images.length > 0 ? (
                  <>
                    <img
                      src={
                        getImageUrl(images[selectedImage].image) ||
                        "/placeholder.svg"
                      }
                      alt={bag.name}
                      className="max-h-[550px] w-full object-contain rounded-xl"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/500x500?text=No+Image";
                      }}
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all rounded-full bg-background/80 backdrop-blur-sm border-0 hover:bg-background shadow-lg"
                          onClick={() => handleImageNavigation("prev")}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all rounded-full bg-background/80 backdrop-blur-sm border-0 hover:bg-background shadow-lg"
                          onClick={() => handleImageNavigation("next")}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium text-foreground shadow-lg">
                        {selectedImage + 1} / {images.length}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[500px] bg-muted rounded-lg">
                    <p className="text-muted-foreground text-sm">
                      No images available
                    </p>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 justify-center overflow-x-auto pb-2 mt-auto scrollbar-hide">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                        selectedImage === idx
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent hover:border-muted-foreground/30"
                      )}
                    >
                      <img
                        src={getImageUrl(img.image) || "/placeholder.svg"}
                        alt={`${bag.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Product Details */}
            <div className="flex flex-col bg-background">
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {/* Product Header */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-4xl font-bold text-foreground leading-tight tracking-tight">
                        {bag.name}
                      </h2>
                    </div>
                  </div>

                  {/* Categories*/}
                  {bag.categories && bag.categories.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-2">
                      {bag.categories.map((cat: any) => (
                        <Badge
                          key={cat.id}
                          variant="secondary"
                          className="text-xs font-medium px-3 py-1"
                        >
                          {cat.categoryName}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-5xl font-bold text-foreground">
                      ${bag.price?.toFixed(2)}
                    </span>
                    {bag.price && (
                      <>
                        <span className="text-lg text-muted-foreground line-through opacity-60">
                          ${(bag.price * 1.2).toFixed(2)}
                        </span>
                        <Badge
                          variant="destructive"
                          className="text-xs font-semibold px-3 py-1.5"
                        >
                          20% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      In Stock • Ships within 24 hours
                    </p>
                  </div>
                </div>

                {/* Description */}
                {bag.description && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      About This Product
                    </h3>
                    <p className="text-foreground leading-relaxed text-sm">
                      {bag.description}
                    </p>
                  </div>
                )}

                {/* Specifications */}
                {bag.description && (
                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Specifications
                    </h3>
                    <div className="space-y-3 bg-muted/20 rounded-lg p-4 border border-border/50">
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-xs uppercase font-medium text-muted-foreground">
                          Material
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          Premium Leather
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-xs uppercase font-medium text-muted-foreground">
                          Dimensions
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          15" × 12" × 5"
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-xs uppercase font-medium text-muted-foreground">
                          Weight
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          1.2 kg
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-xs uppercase font-medium text-muted-foreground">
                          Color
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          Black
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {/* Key Features Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Premium Quality
                      </p>
                      <p className="text-sm text-foreground">
                        Crafted with care
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Free Shipping
                      </p>
                      <p className="text-sm text-foreground">On all orders</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <RotateCcw className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        30-Day Returns
                      </p>
                      <p className="text-sm text-foreground">
                        No questions asked
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Warranty
                      </p>
                      <p className="text-sm text-foreground">
                        1-year guarantee
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Bottom - Add to Cart Section */}
              <div className="border-t border-border/50 bg-background/95 backdrop-blur-lg p-6 space-y-5 shadow-2xl">
                <div className="space-y-3">
                  {/* Render AddToCart in a full-width container */}
                  <div className="relative w-full">
                    <AddToCart bagId={bagId} className="w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <p className="text-lg font-semibold text-foreground">
                Product not found
              </p>
              <p className="text-sm text-muted-foreground">
                This product may have been removed or is no longer available.
              </p>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetailProduct;
