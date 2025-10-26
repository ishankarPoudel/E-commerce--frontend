import { getCategoriesWithBagsOptions } from "@/api/@tanstack/react-query.gen";
import AddToCart from "@/ui/molecules/Buttons/AddToCart";
import { Button } from "@/ui/shadcn/button";
import { Card, CardContent } from "@/ui/shadcn/card";
import { Separator } from "@/ui/shadcn/separator";
import { getImageUrl } from "@/utils/urlHelpers";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

export default function CategoryBasedBags() {
  const { data: bagsList, isPending: isBagListPending } = useQuery({
    ...getCategoriesWithBagsOptions({
      query: {
        page: 1,
        limit: 10,
      },
    }),
  });

  if (isBagListPending) {
    return (
      <div className='flex items-center justify-center min-h-[50vh] text-gray-500'>
        Loading...
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto p-6 bg-background'>
      {bagsList?.data.data.map((category) => (
        <div key={category.id} className='mb-12'>
          {/* Category Header */}
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-playfair font-semibold text-foreground'>
              {category.categoryName}
            </h2>
            <Button
              variant='ghost'
              className='text-muted-foreground hover:text-foreground hover:bg-transparent px-2'>
              View all ({category.bags.length})
              <ChevronRight className='ml-1 h-4 w-4' />
            </Button>
          </div>
          <Separator className='mb-6' />

          {/* Products Grid - Horizontal scroll */}
          <div className='flex gap-6 overflow-x-auto pb-4 scrollbar-hide'>
            {category.bags.map((bag) => (
              <Card
                key={bag.id}
                className='flex-shrink-0 w-52 border border-border hover:shadow-md transition-shadow rounded-2xl bg-card'>
                <CardContent className='p-3'>
                  <div className='relative mb-4'>
                    <img
                      src={
                        bag.bagImages.length > 0
                          ? getImageUrl(bag.bagImages[0].image)
                          : "/placeholder.svg?height=200&width=200"
                      }
                      alt={bag.bagImages[0]?.altText || bag.name}
                      className='w-full h-40 object-cover rounded-xl bg-muted'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg?height=200&width=200";
                      }}
                    />

                    {/* Floating Add to Cart */}
                    <div className='absolute top-1 right-0'>
                      <AddToCart bagId={bag.id} />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <h3 className='text-sm font-semibold text-foreground line-clamp-2 leading-snug'>
                      {bag.name}
                    </h3>

                    {/* Price */}
                    <div className='flex items-baseline gap-1'>
                      <span className='text-base font-medium text-foreground'>
                        Rs {bag.price.toFixed(2).split(".")[0]}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {bag.price.toFixed(2).split(".")[1]}
                      </span>
                    </div>

                    {/* Stock */}
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 bg-green-500 rounded-full' />
                      <span className='text-xs text-green-600'>In stock</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
