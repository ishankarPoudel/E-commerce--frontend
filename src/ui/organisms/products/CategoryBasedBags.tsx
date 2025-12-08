import { getCategoriesWithBagsOptions } from "@/api/@tanstack/react-query.gen";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/shadcn/dialog";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Grid3X3, Loader2, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { ProductDetailPanel } from "./DetailProduct";
import {
  type Product,
  ProductCard,
} from "@/ui/pages/Customer/Search/ProductCard";

export default function CategoryBasedBags() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: listOfBag, isPending: isBagListPending } = useQuery({
    ...getCategoriesWithBagsOptions({
      query: {
        page: 1,
        limit: 10,
      },
    }),
  });

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      setTimeout(checkScrollButtons, 300);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener("resize", handleResize);

    const observer = new ResizeObserver(() => {
      checkScrollButtons();
    });

    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [listOfBag]);

  const handleBagClick = (bag: Product) => {
    setSelectedProduct(bag);
    setOpenDialog(null);
  };

  const bagsList = listOfBag;

  if (isBagListPending) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading bags...</span>
        </div>
      </div>
    );
  }

  if (!bagsList?.data?.data || bagsList.data.data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-muted-foreground">
        No categories found
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="max-w-7xl mx-auto p-6 bg-background space-y-12">
        {bagsList.data.data.map(
          (category: { id: string; categoryName: string; bags: any[] }) => {
            const hasMoreBags = category.bags.length > 5;

            return (
              <section key={category.id} className="space-y-4">
                <div className="flex items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-transparent py-3 -mx-6 px-6">
                  <h2 className="text-2xl font-playfair font-semibold text-foreground">
                    {category.categoryName}
                  </h2>

                  {hasMoreBags && (
                    <Dialog
                      open={openDialog === category.id}
                      onOpenChange={(open) =>
                        setOpenDialog(open ? category.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-muted-foreground hover:text-foreground hover:bg-transparent px-2 group"
                        >
                          <span>View all ({category.bags.length})</span>
                          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent
                        className="max-w-[95vw] min-w-[90vw] h-[85vh] p-0"
                        onPointerDownOutside={(e) => e.preventDefault()}
                      >
                        <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-background p-6">
                          <div className="flex items-center gap-3">
                            <Grid3X3 className="h-6 w-6 text-primary" />
                            <h2 className="text-xl font-semibold">
                              {category.categoryName}
                            </h2>
                            <Badge variant="secondary" className="text-sm">
                              {category.bags.length} items
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full hover:bg-muted/60"
                            onClick={() => setOpenDialog(null)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="p-8 overflow-y-auto h-[calc(85vh-80px)]">
                          <div className="grid grid-cols-5 gap-8">
                            {category.bags.map((bag) => (
                              <div
                                key={bag.id}
                                onClick={() => handleBagClick(bag)}
                                className="cursor-pointer"
                              >
                                <ProductCard
                                  product={bag}
                                  onClick={() => handleBagClick(bag)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="relative pt-2">
                  {canScrollLeft && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
                      onClick={() => scroll("left")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  )}

                  {canScrollRight && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
                      onClick={() => scroll("right")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}

                  <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-4 w-full scroll-smooth"
                    onScroll={checkScrollButtons}
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {category.bags.map((bag) => (
                      <div
                        key={bag.id}
                        className="flex-shrink-0 w-52 cursor-pointer"
                        onClick={() => handleBagClick(bag)}
                      >
                        <ProductCard
                          product={bag}
                          onClick={() => handleBagClick(bag)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }
        )}
      </div>
      {selectedProduct && (
        <ProductDetailPanel
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
