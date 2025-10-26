import { Checkbox } from "@/ui/shadcn/checkbox";
import { Label } from "@/ui/shadcn/label";
import { Separator } from "@/ui/shadcn/separator";
import { Slider } from "@/ui/shadcn/slider";

interface ProductFiltersProps {
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (value: string[]) => void;
  brands: string[];
  selectedBrands: string[];
  setSelectedBrands: (value: string[]) => void;
  colors: string[];
  selectedColors: string[];
  setSelectedColors: (value: string[]) => void;
  showInStockOnly: boolean;
  setShowInStockOnly: (value: boolean) => void;
}

export function BagFilter({
  priceRange,
  setPriceRange,
  categories,
  selectedCategories,
  setSelectedCategories,
  brands,
  selectedBrands,
  setSelectedBrands,
  colors,
  selectedColors,
  setSelectedColors,
  showInStockOnly,
  setShowInStockOnly,
}: ProductFiltersProps) {
  const toggleCategory = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(
      selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(
      selectedColors.includes(color)
        ? selectedColors.filter((c) => c !== color)
        : [...selectedColors, color]
    );
  };

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">
            Price Range
          </h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={500}
            step={10}
            className="w-full"
          />
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm font-normal text-foreground cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Brand</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm font-normal text-foreground cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Color</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(color)}
                onCheckedChange={() => toggleColor(color)}
              />
              <Label
                htmlFor={`color-${color}`}
                className="text-sm font-normal text-foreground cursor-pointer"
              >
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={showInStockOnly}
            onCheckedChange={(checked) =>
              setShowInStockOnly(checked as boolean)
            }
          />
          <Label
            htmlFor="in-stock"
            className="text-sm font-normal text-foreground cursor-pointer"
          >
            In stock only
          </Label>
        </div>
      </div>
    </div>
  );
}
