import { getCategoriesWithBagsOptions } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/ui/shadcn/button";
import { Card, CardContent } from "@/ui/shadcn/card";
import { getImageUrl } from "@/utils/urlHelpers";
import { useQuery } from "@tanstack/react-query";
import { Plus, ChevronRight } from "lucide-react";

export default function CategoryBasedBags() {
  const { data: bagsList, isPending: isBagListPending } = useQuery({
    ...getCategoriesWithBagsOptions({
      query: {
        page: 1,
        limit: 10,
      },
    }),
  });

  console.log("bagsList", bagsList);
  if (isBagListPending) {
    return <div className='text-center text-gray-500'>Loading...</div>;
  }
  return (
    <>
      {" "}
      <div className='max-w-7xl mx-auto p-4 bg-white'>
        {bagsList?.data.data.map((category) => (
          <div key={category.id} className='mb-8'>
            {/* Category Header */}
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-2xl font-semibold text-gray-900'>
                {category.categoryName}
              </h2>
              <Button
                variant='ghost'
                className='text-gray-600 hover:text-gray-900'>
                View all ({category.bags.length})
                <ChevronRight className='ml-1 h-4 w-4' />
              </Button>
            </div>

            {/* Products Grid */}
            <div className='flex gap-4 overflow-x-auto pb-4'>
              {category.bags.map((bag) => (
                <Card
                  key={bag.id}
                  className='flex-shrink-0 w-48 border-0 shadow-none'>
                  <CardContent className='p-3'>
                    <div className='relative mb-3'>
                      <img
                        src={
                          bag.bagImages.length > 0
                            ? getImageUrl(bag.bagImages[0].image)
                            : "/placeholder.svg?height=120&width=120"
                        }
                        alt={bag.bagImages[0]?.altText || bag.name}
                        width={120}
                        height={120}
                        className='w-full h-32 object-cover rounded-lg'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=120&width=120";
                        }}
                      />
                      <Button
                        size='sm'
                        className='absolute top-2 right-2 h-8 px-3 text-xs font-medium bg-green-600 hover:bg-green-700'>
                        <Plus className='h-3 w-3 mr-1' />
                      </Button>
                    </div>

                    <div className='space-y-2'>
                      <h3 className='text-base font-semibold text-gray-900 line-clamp-2 leading-tight'>
                        {bag.name}
                      </h3>

                      <div className='flex items-baseline gap-1'>
                        <span className='text-sm text-gray-600'>
                          Rs {bag.price.toFixed(2).split(".")[0]}
                        </span>
                        <span className='text-xs text-gray-500'>
                          {bag.price.toFixed(2).split(".")[1]}
                        </span>
                      </div>

                      <div className='flex items-center gap-1'>
                        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
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
    </>
  );
}
