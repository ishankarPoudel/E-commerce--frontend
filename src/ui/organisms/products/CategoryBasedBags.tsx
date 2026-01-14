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
  const scrollContainerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [scrollStates, setScrollStates] = useState<
    Map<string, { canScrollLeft: boolean; canScrollRight: boolean }>
  >(new Map());
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: listOfBag, isPending } = useQuery({
    ...getCategoriesWithBagsOptions({
      query: { page: 1, limit: 10 },
    }),
  });

  const checkScrollButtons = (categoryId: string) => {
    const container = scrollContainerRefs.current.get(categoryId);
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setScrollStates((prev) => {
      const map = new Map(prev);
      map.set(categoryId, {
        canScrollLeft: scrollLeft > 0,
        canScrollRight: scrollLeft < scrollWidth - clientWidth - 10,
      });
      return map;
    });
  };

  const scroll = (categoryId: string, direction: "left" | "right") => {
    const container = scrollContainerRefs.current.get(categoryId);
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;

    container.scrollTo({
      left:
        container.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount),
      behavior: "smooth",
    });

    setTimeout(() => checkScrollButtons(categoryId), 300);
  };

  useEffect(() => {
    if (!listOfBag?.data?.data) return;

    listOfBag.data.data.forEach((c: { id: string }) =>
      checkScrollButtons(c.id)
    );

    const onResize = () => {
      listOfBag.data.data.forEach((c: { id: string }) =>
        checkScrollButtons(c.id)
      );
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [listOfBag]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!listOfBag?.data?.data?.length) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-muted-foreground">
        No categories found
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-12">
        {listOfBag.data.data.map(
          //@ts-expect-error
          (category: { id: string; categoryName: string; bags: Product[] }) => {
            const scrollState = scrollStates.get(category.id) || {
              canScrollLeft: false,
              canScrollRight: false,
            };

            return (
              <section key={category.id} className="space-y-4">
                {/* HEADER */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-playfair font-semibold">
                    {category.categoryName}
                  </h2>

                  {category.bags.length > 5 && (
                    <Dialog
                      open={openDialog === category.id}
                      onOpenChange={(o) =>
                        setOpenDialog(o ? category.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="px-2">
                          View all ({category.bags.length})
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="max-w-[95vw] h-[85vh] p-0">
                        {/* Dialog Header */}
                        <div className="flex items-center justify-between border-b p-4 sm:p-6">
                          <div className="flex items-center gap-3">
                            <Grid3X3 className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">
                              {category.categoryName}
                            </h3>
                            <Badge variant="secondary">
                              {category.bags.length}
                            </Badge>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpenDialog(null)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Dialog Grid */}
                        <div className="p-4 sm:p-6 overflow-y-auto h-[calc(85vh-70px)]">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                            {category.bags.map((bag) => (
                              <ProductCard
                                key={bag.id}
                                product={bag}
                                onClick={() => {
                                  setSelectedProduct(bag);
                                  setOpenDialog(null);
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {/* SCROLL AREA */}
                <div className="relative">
                  {scrollState.canScrollLeft && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10"
                      onClick={() => scroll(category.id, "left")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  )}

                  {scrollState.canScrollRight && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10"
                      onClick={() => scroll(category.id, "right")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}

                  <div
                    ref={(el) => {
                      if (el) scrollContainerRefs.current.set(category.id, el);
                    }}
                    onScroll={() => checkScrollButtons(category.id)}
                    className="
                      flex gap-3 sm:gap-4 md:gap-6
                      overflow-x-auto pb-4
                      scroll-smooth
                      snap-x snap-mandatory
                    "
                    style={{ scrollbarWidth: "none" }}
                  >
                    {category.bags.map((bag) => (
                      <div
                        key={bag.id}
                        className="
                          flex-shrink-0
                          w-[150px] sm:w-[180px] md:w-52
                          snap-start
                        "
                      >
                        <ProductCard
                          product={bag}
                          onClick={() => setSelectedProduct(bag)}
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
          isOpen
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
