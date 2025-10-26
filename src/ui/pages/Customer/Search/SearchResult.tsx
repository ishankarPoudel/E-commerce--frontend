import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shadcn/popover";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { BagCard } from "./BagCard";
import { BagFilter } from "./BagFilter";
import { useQuery } from "@tanstack/react-query";
import { searchBagsOptions } from "@/api/@tanstack/react-query.gen";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const SearchResult = ({ q }: { q: string }) => {
  const [searchQuery, setSearchQuery] = useState(q || "");
  const debouncedSearch = useDebouncedValue(searchQuery, 500);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  console.log("Search Query:", q);
  const { data, isLoading, isError } = useQuery({
    ...searchBagsOptions({
      query: {
        query: (debouncedSearch as string) || "",
      },
    }),
    enabled: Boolean(debouncedSearch.trim()),
  });

  console.log("Search Data:", data?.data);

  const apiProducts = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return [];

    return data.data.map((item: any) => ({
      id: item.id,
      name: item.name || "Unknown Product",
      price: item.price || 0,
      category:
        Array.isArray(item.categories) && item.categories.length > 0
          ? item.categories[0].categoryName
          : "Uncategorized",
      brand: item.brand || "Unknown Brand", // Add this if available in your API
      color: item.color || "Unknown Color", // Add this if available in your API
      image:
        Array.isArray(item.bagImages) && item.bagImages.length > 0
          ? item.bagImages[0].image
          : "/placeholder-bag.jpg",
      inStock: item.inStock !== false, // Assuming in stock by default
    }));
  }, [data?.data]);

  // Extract unique values for filters from API data
  const categories = useMemo(() => {
    return Array.from(new Set(apiProducts.map((p) => p.category)));
  }, [apiProducts]);

  const brands = useMemo(() => {
    return Array.from(new Set(apiProducts.map((p) => p.brand)));
  }, [apiProducts]);

  const colors = useMemo(() => {
    return Array.from(new Set(apiProducts.map((p) => p.color)));
  }, [apiProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    const products = apiProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesColor =
        selectedColors.length === 0 || selectedColors.includes(product.color);
      const matchesStock = !showInStockOnly || product.inStock;

      return (
        matchesSearch &&
        matchesPrice &&
        matchesCategory &&
        matchesBrand &&
        matchesColor &&
        matchesStock
      );
    });

    // Sort products
    if (sortBy === "price-low") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    return products;
  }, [
    searchQuery,
    priceRange,
    selectedCategories,
    selectedBrands,
    selectedColors,
    showInStockOnly,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 500]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setShowInStockOnly(false);
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    selectedColors.length +
    (showInStockOnly ? 1 : 0);

  const hasActiveFilters =
    searchQuery ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 500 ||
    activeFilterCount > 0;
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          {/* Search and Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search bags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* All Filters Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent relative"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 h-5 min-w-5 rounded-full px-1.5"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 max-h-[500px] overflow-y-auto"
                  align="start"
                >
                  <BagFilter
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    categories={categories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    brands={brands}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    colors={colors}
                    selectedColors={selectedColors}
                    setSelectedColors={setSelectedColors}
                    showInStockOnly={showInStockOnly}
                    setShowInStockOnly={setShowInStockOnly}
                  />
                </PopoverContent>
              </Popover>

              {/* Sort Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
                    Sort
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="start">
                  <div className="space-y-1">
                    <Button
                      variant={sortBy === "featured" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSortBy("featured")}
                    >
                      Featured
                    </Button>
                    <Button
                      variant={sortBy === "price-low" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSortBy("price-low")}
                    >
                      Price: Low to High
                    </Button>
                    <Button
                      variant={sortBy === "price-high" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSortBy("price-high")}
                    >
                      Price: High to Low
                    </Button>
                    <Button
                      variant={sortBy === "name" ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSortBy("name")}
                    >
                      Name: A to Z
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active Filter Tags */}
          {(selectedCategories.length > 0 ||
            selectedBrands.length > 0 ||
            selectedColors.length > 0 ||
            showInStockOnly) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedCategories.map((category) => (
                <Badge key={category} variant="secondary" className="gap-1">
                  {category}
                  <button
                    onClick={() =>
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== category)
                      )
                    }
                    className="ml-1 hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedBrands.map((brand) => (
                <Badge key={brand} variant="secondary" className="gap-1">
                  {brand}
                  <button
                    onClick={() =>
                      setSelectedBrands(
                        selectedBrands.filter((b) => b !== brand)
                      )
                    }
                    className="ml-1 hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedColors.map((color) => (
                <Badge key={color} variant="secondary" className="gap-1">
                  {color}
                  <button
                    onClick={() =>
                      setSelectedColors(
                        selectedColors.filter((c) => c !== color)
                      )
                    }
                    className="ml-1 hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {showInStockOnly && (
                <Badge variant="secondary" className="gap-1">
                  In Stock Only
                  <button
                    onClick={() => setShowInStockOnly(false)}
                    className="ml-1 hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Products Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Searching..."
              : `${filteredProducts.length} ${
                  filteredProducts.length === 1 ? "product" : "products"
                }`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-destructive mb-2">
              Something went wrong
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Please try again later
            </p>
          </div>
        )}

        {/* No Results */}
        {!isLoading &&
          !isError &&
          filteredProducts.length === 0 &&
          debouncedSearch && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-lg text-muted-foreground mb-2">
                No products found
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your filters or search query
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          )}

        {/* Empty State (no search query) */}
        {!isLoading && !isError && !debouncedSearch && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-muted-foreground mb-2">
              Start typing to search for products
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !isError && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product: any) => (
              <BagCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResult;
