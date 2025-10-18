import { useState, useEffect, useRef } from "react";
import { Search, TrendingUp, Clock } from "lucide-react";
import { Input } from "@/ui/shadcn/input";
import { Card } from "@/ui/shadcn/card";
import { Badge } from "@/ui/shadcn/badge";
import { useQuery } from "@tanstack/react-query";
import { searchBagsOptions } from "@/api/@tanstack/react-query.gen";
import { getImageUrl } from "@/utils/urlHelpers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

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
  console.log("Search data:", data);

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
      image: Array.isArray(item?.bagImages)
        ? String(item.bagImages[0]?.image ?? "")
        : "",
    }));

    setFilteredResults(normalized);
  }, [searchQuery, data]);

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setIsOpen(true);
  };

  return (
    <div ref={searchRef} className='relative max-w-2xl w-full'>
      <div className='relative'>
        <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
        <Input
          type='text'
          placeholder='Search for bags...'
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
          onFocus={handleFocus}
          className='pl-12 pr-4 w-full h-14 text-base rounded-full border border-input bg-background shadow-sm transition-all focus:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1'
        />
      </div>

      {isLoading && (
        <div className='absolute top-full mt-3 w-full rounded-2xl shadow-2xl z-50 border border-border backdrop-blur-md bg-background/90 p-4 text-center text-sm text-muted-foreground'>
          Loading...
        </div>
      )}
      {isError && (
        <div className='absolute top-full mt-3 w-full rounded-2xl shadow-2xl z-50 border border-border backdrop-blur-md bg-background/90 p-4 text-center text-sm text-red-500'>
          Error fetching search results.
        </div>
      )}

      {isOpen && (
        <Card className='absolute top-full mt-3 w-full max-h-[500px] overflow-hidden rounded-2xl shadow-2xl z-50 border border-border backdrop-blur-md bg-background/90 transition-all duration-200'>
          <div className='overflow-y-auto max-h-[500px] p-3 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent'>
            {!searchQuery.trim() ? (
              <div className='space-y-6'>
                {/* Trending */}
                <div>
                  <h3 className='text-sm font-semibold mb-3 flex items-center gap-2 text-foreground/80'>
                    <TrendingUp className='h-4 w-4 text-primary' />
                    Trending Searches
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {data?.data.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.name)}
                        className='px-4 py-2 text-sm rounded-full bg-accent/60 hover:bg-accent text-foreground transition-all shadow-sm'>
                        {suggestion.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent */}
                <div>
                  <h3 className='text-sm font-semibold mb-3 flex items-center gap-2 text-foreground/80'>
                    <Clock className='h-4 w-4 text-primary' />
                    Recent Searches
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {data?.data.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion.name)}
                        className='px-4 py-2 text-sm rounded-full bg-muted hover:bg-accent text-muted-foreground transition-all shadow-sm'>
                        {suggestion.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {filteredResults.length > 0 ? (
                  <>
                    <p className='text-sm text-muted-foreground mb-4 px-1'>
                      {filteredResults.length} result
                      {filteredResults.length !== 1 ? "s" : ""} found
                    </p>
                    <div className='space-y-2'>
                      {filteredResults.map((result) => (
                        <button
                          key={String(result.id)}
                          className='w-full flex items-center gap-4 p-3 rounded-xl hover:bg-accent/70 transition-all text-left border border-transparent hover:border-border'>
                          <img
                            src={
                              result.image
                                ? getImageUrl(result.image)
                                : "/placeholder.svg"
                            }
                            alt={result.name}
                            className='w-20 h-20 object-cover rounded-lg bg-muted shadow-sm'
                          />
                          <div className='flex-1 min-w-0'>
                            <h4 className='font-medium text-base mb-1 truncate text-foreground'>
                              {result.name}
                            </h4>
                            <Badge variant='secondary' className='mb-2'>
                              {result.category}
                            </Badge>
                            <p className='text-lg font-semibold text-primary'>
                              ${result.price}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className='text-center py-10'>
                    <p className='text-muted-foreground text-base'>
                      No results found for{" "}
                      <span className='font-medium'>{searchQuery}</span>
                    </p>
                    <p className='text-sm text-muted-foreground mt-2'>
                      Try different keywords
                    </p>
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
