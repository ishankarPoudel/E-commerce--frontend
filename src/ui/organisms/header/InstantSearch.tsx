import { useState, useEffect, useRef } from "react";
import { Search, TrendingUp, Clock } from "lucide-react";
import { Input } from "@/ui/shadcn/input";
import { Card } from "@/ui/shadcn/card";
import { Badge } from "@/ui/shadcn/badge";

interface SearchResult {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface Suggestion {
  text: string;
  type: "trending" | "recent";
}

const mockSuggestions: Suggestion[] = [
  { text: "Leather Tote Bags", type: "trending" },
  { text: "Crossbody Bags", type: "trending" },
  { text: "Designer Handbags", type: "trending" },
  { text: "Travel Backpacks", type: "recent" },
  { text: "Laptop Bags", type: "recent" },
];

const mockResults: SearchResult[] = [
  {
    id: 1,
    name: "Classic Leather Tote",
    category: "Tote Bags",
    price: 129.99,
    image: "/leather-tote-bag.png",
  },
  {
    id: 2,
    name: "Minimalist Crossbody",
    category: "Crossbody Bags",
    price: 89.99,
    image: "/stylish-crossbody-bag.png",
  },
  {
    id: 3,
    name: "Designer Shoulder Bag",
    category: "Shoulder Bags",
    price: 249.99,
    image: "/designer-shoulder-bag.jpg",
  },
  {
    id: 4,
    name: "Travel Backpack Pro",
    category: "Backpacks",
    price: 159.99,
    image: "/travel-backpack.png",
  },
  {
    id: 5,
    name: "Professional Laptop Bag",
    category: "Laptop Bags",
    price: 99.99,
    image: "/laptop-bag.jpg",
  },
];

export function InstantSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

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
    if (searchQuery.trim()) {
      const results = mockResults.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  }, [searchQuery]);

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setIsOpen(true);
  };

  return (
    <div ref={searchRef} className='relative max-w-2xl'>
      <div className='relative'>
        <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
        <Input
          type='text'
          placeholder='Search for bags...'
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
          onFocus={handleFocus}
          className='pl-12 w-full pr-4 h-14 text-base rounded-full border-2 focus-visible:ring-2 focus-visible:ring-primary'
        />
      </div>

      {isOpen && (
        <Card className='absolute top-full mt-2 w-full max-h-[500px] overflow-hidden shadow-2xl z-50 border-2'>
          <div className='overflow-y-auto max-h-[500px]'>
            {!searchQuery.trim() ? (
              <div className='p-4'>
                <div className='mb-4'>
                  <h3 className='text-sm font-semibold mb-3 flex items-center gap-2'>
                    <TrendingUp className='h-4 w-4' />
                    Trending Searches
                  </h3>
                  <div className='space-y-2'>
                    {mockSuggestions
                      .filter((s) => s.type === "trending")
                      .map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion.text)}
                          className='w-full text-left px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm'>
                          {suggestion.text}
                        </button>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className='text-sm font-semibold mb-3 flex items-center gap-2'>
                    <Clock className='h-4 w-4' />
                    Recent Searches
                  </h3>
                  <div className='space-y-2'>
                    {mockSuggestions
                      .filter((s) => s.type === "recent")
                      .map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion.text)}
                          className='w-full text-left px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground'>
                          {suggestion.text}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className='p-4'>
                {filteredResults.length > 0 ? (
                  <>
                    <p className='text-sm text-muted-foreground mb-4'>
                      {filteredResults.length} result
                      {filteredResults.length !== 1 ? "s" : ""} found
                    </p>
                    <div className='space-y-3'>
                      {filteredResults.map((result) => (
                        <button
                          key={result.id}
                          className='w-full flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors text-left'>
                          <img
                            src={result.image || "/placeholder.svg"}
                            alt={result.name}
                            className='w-20 h-20 object-cover rounded-md bg-muted'
                          />
                          <div className='flex-1 min-w-0'>
                            <h4 className='font-medium text-base mb-1 truncate'>
                              {result.name}
                            </h4>
                            <Badge variant='secondary' className='mb-2'>
                              {result.category}
                            </Badge>
                            <p className='text-lg font-semibold'>
                              ${result.price}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className='text-center py-8'>
                    <p className='text-muted-foreground'>
                      No results found for "{searchQuery}"
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
