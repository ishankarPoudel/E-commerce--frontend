import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Input } from "@/ui/shadcn/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shadcn/popover";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BagCard } from "./ProductCard";
import { BagFilter } from "./BagFilter";
import { useQuery } from "@tanstack/react-query";
import {
  getBagsByCategoryIdOptions,
  searchBagsOptions,
} from "@/api/@tanstack/react-query.gen";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const SearchResult = ({
  q,
  category,
  categoryId,
}: {
  q: string;
  category: string;
  categoryId: string;
}) => {
  const [searchQuery, setSearchQuery] = useState(q || "");
  const debouncedSearch = useDebouncedValue(searchQuery, 500);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  // Set initial category if provided from URL
  useEffect(() => {
    if (category && category.trim() && !selectedCategories.includes(category)) {
      setSelectedCategories([category]);
    }
  }, [category]);

  // Search bags query (text search)
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useQuery({
    ...searchBagsOptions({
      query: {
        query: (debouncedSearch as string) || "",
      },
    }),
    enabled: Boolean(debouncedSearch.trim()),
  });

  // Bags by category query
  const {
    data: bagsByCategoryData,
    isLoading: isLoadingBagsByCategory,
    isError: isCategoryError,
  } = useQuery({
    ...getBagsByCategoryIdOptions({
      query: {
        categoryId: categoryId || "",
      },
    }),
    enabled: Boolean(categoryId),
  });

  console.log("Search Data:", searchData?.data);
  console.log("Bags by Category Data:", bagsByCategoryData?.data);

  // Transform and combine API data
  const apiProducts = useMemo(() => {
    const transformBagData = (bagData: any[]) => {
      return bagData.map((item: any) => ({
        id: item.id,
        name: item.name || "Unknown Product",
        price: item.price || 0,
        description: item.description || "",
        category:
          Array.isArray(item.categories) && item.categories.length > 0
            ? item.categories[0].categoryName
            : "Uncategorized",
        brand: item.brand || "Various", // Default since API doesn't provide brand
        color: item.color || "Mixed", // Default since API doesn't provide color
        image:
          Array.isArray(item.bagImages) && item.bagImages.length > 0
            ? item.bagImages[0].image
            : "/placeholder-bag.jpg",
        inStock: item.inStock !== false, // Default to true
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
    };

    let combinedProducts: any[] = [];

    // Add search results if available
    if (searchData?.data && Array.isArray(searchData.data)) {
      combinedProducts = [
        ...combinedProducts,
        ...transformBagData(searchData.data),
      ];
    }

    // Add category-based results if available
    if (bagsByCategoryData?.data && Array.isArray(bagsByCategoryData.data)) {
      const categoryProducts = transformBagData(bagsByCategoryData.data);

      // Avoid duplicates by checking if product ID already exists
      const existingIds = new Set(combinedProducts.map((p) => p.id));
      const uniqueCategoryProducts = categoryProducts.filter(
        (p) => !existingIds.has(p.id)
      );

      combinedProducts = [...combinedProducts, ...uniqueCategoryProducts];
    }

    return combinedProducts;
  }, [searchData?.data, bagsByCategoryData?.data]);

  // Extract filter options from combined data
  const categories = useMemo(() => {
    return Array.from(new Set(apiProducts.map((p) => p.category)));
  }, [apiProducts]);

  const brands = useMemo(() => {
    return Array.from(new Set(apiProducts.map((p) => p.brand)));
  }, [apiProducts]);

  const colors = useMemo(() => {
    return Array.from(new Set(apiProducts.map((p) => p.color)));
  }, [apiProducts]);

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    const products = apiProducts.filter((product) => {
      // Text search matching (only apply if there's a search query)
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Price range matching
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      // Category matching
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      // Brand matching
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);

      // Color matching
      const matchesColor =
        selectedColors.length === 0 || selectedColors.includes(product.color);

      // Stock matching
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
    switch (sortBy) {
      case "price-low":
        return products.sort((a, b) => a.price - b.price);
      case "price-high":
        return products.sort((a, b) => b.price - a.price);
      case "name":
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
        return products.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return products;
    }
  }, [
    apiProducts,
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

  // Determine loading and error states
  const isLoading = isSearchLoading || isLoadingBagsByCategory;
  const isError = isSearchError || isCategoryError;

  // Determine if we should show content
  const shouldShowContent = Boolean(
    debouncedSearch.trim() || // Has search query
      categoryId || // Has category ID
      apiProducts.length > 0 // Has products to show
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          {/* Context Display */}
          <div className="mb-3">
            {category && !searchQuery && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Browsing category:
                </span>
                <Badge variant="secondary">{category}</Badge>
              </div>
            )}
            {searchQuery && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Searching for:
                </span>
                <Badge variant="secondary">{searchQuery}</Badge>
                {category && (
                  <>
                    <span className="text-sm text-muted-foreground">in</span>
                    <Badge variant="outline">{category}</Badge>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
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
                    {[
                      { value: "featured", label: "Featured" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                      { value: "name", label: "Name: A to Z" },
                      { value: "newest", label: "Newest First" },
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={
                          sortBy === option.value ? "secondary" : "ghost"
                        }
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSortBy(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
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
                  ``
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
              ? "Loading products..."
              : `${filteredProducts.length} ${
                  filteredProducts.length === 1 ? "product" : "products"
                } found`}
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
          shouldShowContent && (
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

        {/* Empty State */}
        {!isLoading && !isError && !shouldShowContent && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-muted-foreground mb-2">
              Start searching or browse by category
            </p>
            <p className="text-sm text-muted-foreground">
              Use the search bar above or select a category to find products
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !isError && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <BagCard key={product.id} product={product} variant="default" />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResult;
