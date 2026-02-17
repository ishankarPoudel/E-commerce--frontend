import { getCategoriesWithBagsOptions } from "@/api/@tanstack/react-query.gen";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Dialog, DialogContent, DialogTrigger } from "@/ui/shadcn/dialog";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ChevronDown, Package } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { ProductDetailPanel } from "./DetailProduct";
import {
  type Product,
  ProductCard,
} from "@/ui/pages/Customer/Search/ProductCard";
import { Skeleton } from "@/ui/shadcn/skeleton";

export default function CategoryBasedBags() {
  const scrollContainerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [scrollStates, setScrollStates] = useState<
    Map<string, { canScrollLeft: boolean; canScrollRight: boolean }>
  >(new Map());
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [visibleItems, setVisibleItems] = useState<Map<string, number>>(
    new Map(),
  );

  const { data: listOfBag, isLoading } = useQuery({
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

  const loadMoreItems = (categoryId: string, increment: number = 8) => {
    setVisibleItems((prev) => {
      const map = new Map(prev);
      const currentCount = map.get(categoryId) || 4;
      map.set(categoryId, currentCount + increment);
      return map;
    });
  };

  const showLessItems = (categoryId: string) => {
    setVisibleItems((prev) => {
      const map = new Map(prev);
      map.set(categoryId, 4);
      return map;
    });
  };

  useEffect(() => {
    if (!listOfBag?.data?.data) return;

    const checkAllScrollButtons = () => {
      if (window.innerWidth >= 768) {
        listOfBag.data.data.forEach((c: { id: string }) =>
          checkScrollButtons(c.id),
        );
      }
    };

    checkAllScrollButtons();

    window.addEventListener("resize", checkAllScrollButtons);

    return () => window.removeEventListener("resize", checkAllScrollButtons);
  }, [listOfBag]);
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" /> {/* Title skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-64 w-full rounded-lg" /> {/* Image */}
              <Skeleton className="h-4 w-3/4" /> {/* Product name */}
              <Skeleton className="h-4 w-1/2" /> {/* Price */}
            </div>
          ))}
        </div>
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
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 sm:space-y-12">
        {listOfBag.data.data.map(
          //@ts-expect-error
          (category: { id: string; categoryName: string; bags: Product[] }) => {
            const scrollState = scrollStates.get(category.id) || {
              canScrollLeft: false,
              canScrollRight: false,
            };

            const INITIAL_ITEMS = 4;
            const LOAD_MORE_CHUNK = 8;
            const currentVisible =
              visibleItems.get(category.id) || INITIAL_ITEMS;
            const totalBags = category.bags.length;

            const mobileDisplayBags = category.bags.slice(0, currentVisible);
            const hasMore = currentVisible < totalBags;
            const remainingCount = totalBags - currentVisible;

            return (
              <section key={category.id} className="space-y-3 sm:space-y-4">
                {/* HEADER */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-playfair font-semibold line-clamp-1">
                      {category.categoryName}
                    </h2>

                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 text-xs shrink-0"
                    >
                      <Package className="h-3 w-3" />
                      {totalBags}
                    </Badge>
                  </div>

                  <Dialog
                    open={openDialog === category.id}
                    onOpenChange={(o) => setOpenDialog(o ? category.id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden md:flex items-center gap-2 ml-auto shrink-0 whitespace-nowrap"
                      >
                        View all
                        <ChevronRight className="h-4 w-4 " />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-[98vw] sm:max-w-[95vw] md:max-w-4xl lg:max-w-5xl xl:max-w-6xl h-[92vh] sm:h-[88vh] md:h-[85vh] p-0 gap-0">
                      <div className="header">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-playfair font-semibold px-4 sm:px-5 py-3 border-b">
                          {category.categoryName}
                        </h2>
                      </div>
                      <div className=" overflow-y-auto px-4 sm:px-5  pb-4 sm:pb-5 h-[calc(88vh-56px)] md:h-[calc(85vh-56px)]">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-4 lg:gap-5">
                          {category.bags.map((bag) => (
                            <div
                              key={bag.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(bag);
                                setOpenDialog(null);
                              }}
                              className="cursor-pointer"
                            >
                              <ProductCard
                                product={bag}
                                onClick={() => setSelectedProduct(bag)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* MOBILE: Grid Layout */}
                <div className="md:hidden">
                  <div className="grid grid-cols-2 gap-3">
                    {mobileDisplayBags.map((bag) => (
                      <div
                        key={bag.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(bag);
                        }}
                      >
                        <ProductCard
                          product={bag}
                          onClick={() => setSelectedProduct(bag)}
                        />
                      </div>
                    ))}
                  </div>

                  {hasMore && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() =>
                        loadMoreItems(category.id, LOAD_MORE_CHUNK)
                      }
                    >
                      Show {Math.min(remainingCount, LOAD_MORE_CHUNK)} More
                      {remainingCount > LOAD_MORE_CHUNK &&
                        ` (${remainingCount} remaining)`}
                      <ChevronDown className="ml-2 h-4 w-4 transition-transform" />
                    </Button>
                  )}

                  {!hasMore && currentVisible > INITIAL_ITEMS && (
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => showLessItems(category.id)}
                    >
                      Show Less
                      <ChevronDown className="ml-2 h-4 w-4 rotate-180 transition-transform" />
                    </Button>
                  )}

                  {totalBags > INITIAL_ITEMS && (
                    <div className="mt-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        Showing {mobileDisplayBags.length} of {totalBags}{" "}
                        products
                      </p>
                      <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{
                            width: `${
                              (mobileDisplayBags.length / totalBags) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden md:block relative group">
                  {totalBags > 3 && scrollState.canScrollRight && (
                    <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none z-0" />
                  )}

                  <Button
                    size="icon"
                    variant="outline"
                    className={`
                      absolute left-0 top-1/2 -translate-y-1/2 z-20 
                      transition-opacity shadow-lg bg-background
                      ${
                        scrollState.canScrollLeft
                          ? "opacity-0 group-hover:opacity-100"
                          : "opacity-0 pointer-events-none"
                      }
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      scroll(category.id, "left");
                    }}
                    disabled={!scrollState.canScrollLeft}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    className={`
                      absolute right-0 top-1/2 -translate-y-1/2 z-20 
                      transition-opacity shadow-lg bg-background
                      ${
                        scrollState.canScrollRight
                          ? "opacity-0 group-hover:opacity-100"
                          : "opacity-0 pointer-events-none"
                      }
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      scroll(category.id, "right");
                    }}
                    disabled={!scrollState.canScrollRight}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <div
                    ref={(el) => {
                      if (el) scrollContainerRefs.current.set(category.id, el);
                    }}
                    onScroll={() => checkScrollButtons(category.id)}
                    className="
                      flex gap-4 lg:gap-6
                      overflow-x-auto 
                      pb-4
                      pr-4
                      scroll-smooth
                      scrollbar-hide
                    "
                    style={{
                      scrollbarWidth: "none",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    {category.bags.map((bag) => (
                      <div
                        key={bag.id}
                        className="flex-shrink-0 w-52 lg:w-56"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(bag);
                        }}
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
          },
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
