import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, TrendingUp } from "lucide-react";
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

interface SearchResult {
  id: string | number;
  name: string;
  category: string;
  price: number;
  image: string;
}

export function InstantSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 500);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError } = useQuery({
    ...searchBagsOptions({
      query: {
        query: (debouncedSearch as string) || "",
      },
    }),
    enabled: Boolean(debouncedSearch.trim()),
  });

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    ...getCategoriesOptions(),
  });

  const categoryData = Array.isArray(categories?.data) ? categories.data : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredResults([]);
      return;
    }

    const items: any[] = Array.isArray(data?.data) ? data!.data : [];

    const filtered = items.filter((item: any) => {
      const nameMatch = item?.name?.toLowerCase()?.includes(q);
      const categoryMatch =
        Array.isArray(item?.categories) &&
        item.categories.some((cat: any) =>
          cat?.categoryName?.toLowerCase()?.includes(q)
        );
      return Boolean(nameMatch || categoryMatch);
    });

    const normalized: SearchResult[] = filtered.map((item: any) => ({
      id: item?.id,
      name: String(item?.name ?? ""),
      category: Array.isArray(item?.categories)
        ? String(item.categories[0]?.categoryName ?? "")
        : "",
      price: Number(item?.price ?? 0),
      image: Array.isArray(item?.images)
        ? String(item.images[0]?.image ?? "")
        : "",
    }));

    setFilteredResults(normalized);
  }, [searchQuery, data]);

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={searchRef} className="relative max-w-3xl w-full mx-auto">
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 transition-colors group-focus-within:text-primary" />
        <Input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          onFocus={handleFocus}
          className="relative pl-12 pr-6 w-full h-12 text-sm rounded-full border-2 border-border bg-card shadow-lg transition-all duration-300 focus:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:ring-offset-0 hover:shadow-xl"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="absolute top-full mt-4 w-full rounded-2xl shadow-2xl z-50 border-2 border-border/50 backdrop-blur-xl bg-card/95 p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm font-medium text-muted-foreground">
              Searching...
            </span>
          </div>
        </Card>
      )}

      {/* Error State */}
      {isError && (
        <Card className="absolute top-full mt-4 w-full rounded-2xl shadow-2xl z-50 border-2 border-destructive/50 backdrop-blur-xl bg-card/95 p-6">
          <p className="text-center text-sm font-medium text-destructive">
            Error fetching search results. Please try again.
          </p>
        </Card>
      )}

      {/* Search Results Dropdown */}
      {isOpen && !isLoading && !isError && (
        <Card className="absolute top-full mt-4 w-full max-h-[600px] overflow-hidden rounded-2xl shadow-2xl z-50 border-2 border-border/50 backdrop-blur-xl bg-card/95 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          <div className="overflow-y-auto max-h-[600px] p-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40">
            {!searchQuery.trim() ? (
              // Popular Categories
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h3 className="text-base font-bold text-foreground">
                    Popular Categories
                  </h3>
                </div>

                {/* Loading State */}
                {isCategoriesLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                )}

                {/* Error State */}
                {isCategoriesError && (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm font-medium text-destructive">
                      Error fetching categories. Please try again.
                    </p>
                  </div>
                )}

                {/* Categories Grid */}
                {/* Categories Grid */}
                {!isCategoriesLoading && !isCategoriesError && (
                  <div className="grid grid-cols-3 gap-2">
                    {categoryData
                      .slice(0, 9)
                      .map((category: any, index: number) => (
                        <Link
                          key={category.id || index}
                          to="/search"
                          search={{
                            q: "",
                            category: category.categoryName,
                            categoryId: String(category.id),
                          }}
                          onClick={() => setIsOpen(false)}
                          className="group relative overflow-hidden rounded-lg border-2 border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-3 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
                        >
                          {/* Hover gradient effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          {/* Content */}
                          <div className="relative flex items-center justify-between gap-2">
                            <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {category.categoryName}
                            </span>
                            <div className="flex-shrink-0 w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <Sparkles className="h-3 w-3 text-primary" />
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              // Search Results
              <div className="space-y-5">
                {filteredResults.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">
                        {filteredResults.length} result
                        {filteredResults.length !== 1 ? "s" : ""} found
                      </p>
                      <Badge
                        variant="secondary"
                        className="font-semibold text-xs"
                      >
                        {searchQuery}
                      </Badge>
                    </div>

                    <Link
                      to="/search"
                      search={{ q: searchQuery, category: "", categoryId: "" }}
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {filteredResults.map((result) => (
                          <div
                            key={String(result.id)}
                            className="group flex flex-col gap-2 p-3 rounded-xl hover:bg-accent/50 transition-all duration-200 text-left border-2 border-transparent hover:border-primary/30 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                          >
                            <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-muted">
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <img
                                src={
                                  result.image
                                    ? getImageUrl(result.image)
                                    : "/placeholder.svg?height=150&width=150"
                                }
                                alt={result.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-semibold text-xs text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                {result.name}
                              </h4>
                              <Badge
                                variant="outline"
                                className="text-[10px] font-medium"
                              >
                                {result.category}
                              </Badge>
                              <p className="text-sm font-bold text-primary">
                                ${result.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-foreground">
                        No results found
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Try searching with different keywords
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
