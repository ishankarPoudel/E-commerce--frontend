import { getCategoriesWithBagsOptions } from "@/api/@tanstack/react-query.gen";
import { BagCard } from "@/ui/pages/Customer/Search/BagCard";
import { Button } from "@/ui/shadcn/button";
import { Separator } from "@/ui/shadcn/separator";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Loader2 } from "lucide-react";

export default function CategoryBasedBags() {
  const { data: listOfBag, isPending: isBagListPending } = useQuery({
    ...getCategoriesWithBagsOptions({
      query: {
        page: 1,
        limit: 10,
      },
    }),
  });

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
    <div className="max-w-7xl mx-auto p-6 bg-background space-y-12">
      {bagsList.data.data.map(
        (category: { id: string; categoryName: string; bags: any[] }) => (
          <section key={category.id} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-playfair font-semibold text-foreground">
                {category.categoryName}
              </h2>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-transparent px-2 group"
              >
                <span>View all ({category.bags.length})</span>
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            <Separator className="mb-6" />

            {/* Products Horizontal Scroll */}
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {category.bags.map((bag) => (
                <BagCard
                  key={bag.id}
                  product={bag}
                  variant="compact"
                  showBrand={false}
                  showCategory={false}
                  onClick={() => {
                    // Handle navigation to product detail
                    console.log("Navigate to product:", bag.id);
                  }}
                />
              ))}
            </div>
          </section>
        )
      )}
    </div>
  );
}
