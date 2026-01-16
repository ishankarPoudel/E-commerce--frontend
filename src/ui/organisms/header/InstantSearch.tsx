import { useState, useEffect, useRef, Activity } from "react";
import { Search, TrendingUp, X } from "lucide-react";
import { Input } from "@/ui/shadcn/input";
import { Card } from "@/ui/shadcn/card";
import { Badge } from "@/ui/shadcn/badge";
import { useQuery } from "@tanstack/react-query";
import {
  getCategoriesOptions,
  searchBagsOptions,
} from "@/api/@tanstack/react-query.gen";
import { getImageUrl } from "@/utils/urlHelpers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Link } from "@tanstack/react-router";

export function InstantSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(searchQuery, 400);
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    ...searchBagsOptions({
      query: { query: debouncedSearch || "" },
    }),
    enabled: Boolean(debouncedSearch.trim()),
  });

  const { data: categories } = useQuery({
    ...getCategoriesOptions(),
  });

  const results = Array.isArray(data?.data) ? data.data : [];
  const categoryData = Array.isArray(categories?.data) ? categories.data : [];

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleClear = () => {
    setSearchQuery("");
    setIsOpen(false);
  };

  return (
    <div
      ref={ref}
      className="w-full max-w-[calc(100vw-2rem)] sm:max-w-md md:max-w-lg lg:max-w-2xl"
    >
      <div className="relative w-full">
        <div className="relative z-[60]">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search products..."
            className="
              h-11
              w-full
              pl-11 pr-11
              text-sm
              rounded-full
              border-2
              border-border/60
              bg-background
              shadow-sm
              focus-visible:ring-2 
              focus-visible:ring-primary/30
              focus-visible:border-primary
              hover:border-border
              transition-all
            "
          />

          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* DROPDOWN */}
        {isOpen && (
          <>
            {/* ✅ Mobile overlay - Fixed positioning */}
            <div
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <Card
              className="
                fixed md:absolute
                inset-x-0 md:left-0 md:right-0
                top-[60px] md:top-full
                md:mt-2
                max-h-[calc(100vh-70px)] md:max-h-[65vh]
                overflow-hidden
                rounded-t-3xl md:rounded-xl
                border-t-2 md:border-2
                bg-card
                shadow-2xl md:shadow-xl
                z-50
                mx-2 md:mx-0
              "
            >
              {/* Mobile drag handle */}
              <div className="md:hidden flex justify-center pt-3 pb-2 bg-card sticky top-0 z-10 border-b">
                <div className="w-12 h-1.5 bg-muted rounded-full" />
              </div>

              {/* ✅ Scrollable content with proper overflow */}
              <div className="h-full overflow-y-auto overscroll-contain">
                <div className="p-4 pb-safe space-y-4">
                  {!searchQuery.trim() ? (
                    <>
                      {/* Popular Categories */}
                      <div className="mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <p className="text-sm font-semibold">
                          Popular Categories
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {categoryData.slice(0, 9).map((c: any) => (
                          <Link
                            key={c.id}
                            to="/search"
                            search={{
                              q: "",
                              category: c.categoryName,
                              categoryId: String(c.id),
                            }}
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg border-2 px-3 py-2.5 text-xs font-medium hover:border-primary hover:bg-primary/5 transition-all text-center"
                          >
                            {c.categoryName}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : results.length > 0 ? (
                    <>
                      {/* Search Results Header */}
                      <div className="mb-3 flex items-center justify-between sticky top-0 bg-card z-10 py-2 border-b">
                        <p className="text-xs text-muted-foreground">
                          {results.length} results
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {searchQuery}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {results.map((item: any) => (
                          <Link
                            key={item.id}
                            to="/search"
                            search={{
                              q: searchQuery,
                              category: "",
                              categoryId: "",
                            }}
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg p-2 hover:bg-accent transition-colors border block"
                          >
                            <div className="mb-2 aspect-square rounded-md bg-muted overflow-hidden">
                              <img
                                src={getImageUrl(item.images?.[0]?.image)}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <p className="text-xs font-semibold line-clamp-2 mb-1">
                              {item.name}
                            </p>
                            <p className="text-sm font-bold text-primary">
                              रु{item.price}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="py-10 text-center">
                      <p className="text-sm text-muted-foreground">
                        No results found for "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
