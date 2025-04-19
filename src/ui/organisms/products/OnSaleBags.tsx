"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { Button } from "@/ui/shadcn/button";
import { Card, CardContent } from "@/ui/shadcn/card";

import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  size: string;
  inStock?: boolean;
};

const products: Product[] = [
  {
    id: "1",
    name: "French's Tomato Ketchup",
    price: 4.65,
    image: "/placeholder.svg?height=200&width=150",
    rating: 5,
    reviews: 264,
    size: "1 L",
    inStock: true,
  },
  {
    id: "2",
    name: "Oreo Christie Original Sandwich Cookies",
    price: 2.69,
    originalPrice: 3.48,
    image: "/placeholder.svg?height=200&width=150",
    rating: 5,
    reviews: 189,
    size: "270 g",
    inStock: true,
  },
  {
    id: "3",
    name: "OREO Chocolate Sandwich Cookies Party Pack",
    price: 6.63,
    image: "/placeholder.svg?height=200&width=150",
    rating: 4,
    reviews: 11,
    size: "Party Pack",
    inStock: true,
  },
  {
    id: "4",
    name: "Red Bull Energy Drink",
    price: 3.25,
    image: "/placeholder.svg?height=200&width=150",
    rating: 4.5,
    reviews: 40,
    size: "250 ml",
    inStock: true,
  },
  {
    id: "5",
    name: "Maggi Masala Noodles",
    price: 0.39,
    image: "/placeholder.svg?height=200&width=150",
    rating: 5,
    reviews: 270,
    size: "70 g",
    inStock: true,
  },
];

export function OnsaleBags() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className='w-full py-6'>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>Buy it again</h2>
        <div className='flex items-center gap-1'>
          <Button
            variant='link'
            className='hidden items-center gap-1 text-gray-900 sm:flex'
            asChild>
            <a href='/buy-again'>
              View all (20+) <ChevronRight className='h-4 w-4' />
            </a>
          </Button>
          <div className='flex gap-1'>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8 rounded-full border-gray-200'
              onClick={scrollLeft}>
              <ChevronLeft className='h-4 w-4' />
              <span className='sr-only'>Scroll left</span>
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8 rounded-full border-gray-200'
              onClick={scrollRight}>
              <ChevronRight className='h-4 w-4' />
              <span className='sr-only'>Scroll right</span>
            </Button>
          </div>
        </div>
      </div>

      <div className='relative'>
        <div
          ref={scrollContainerRef}
          className='flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-4'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className='w-[160px] border-gray-200 transition-all hover:shadow-md sm:w-[180px] md:w-[200px]'>
      <CardContent className='p-3'>
        <div className='relative mb-2 aspect-square overflow-hidden rounded-md'>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className='h-full w-full object-cover'
          />
          <Button
            size='sm'
            className='absolute right-2 top-2 h-8 w-8 rounded-full bg-green-600 p-0 text-white hover:bg-green-700'>
            <Plus className='h-5 w-5' />
            <span className='sr-only'>Add {product.name} to cart</span>
          </Button>
        </div>

        <div className='space-y-1'>
          <div className='flex items-baseline gap-1'>
            <span className='text-lg font-bold'>${product.price}</span>
            <span className='text-sm text-gray-500'>
              {product.price.toString().split(".")[1] || "00"}
            </span>
            {product.originalPrice && (
              <span className='text-xs text-gray-400 line-through'>
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <h3 className='line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-tight'>
            {product.name}
          </h3>

          <div className='flex items-center'>
            <div className='flex'>
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : i < product.rating
                        ? "text-yellow-400" // For half stars, we'd need a different approach
                        : "text-gray-300"
                  )}
                  filled={i < Math.floor(product.rating)}
                />
              ))}
            </div>
            <span className='ml-1 text-xs text-gray-500'>
              ({product.reviews})
            </span>
          </div>

          <div className='text-xs text-gray-500'>{product.size}</div>

          {product.inStock && (
            <div className='flex items-center text-xs text-green-700'>
              <div className='mr-1 h-2 w-2 rounded-full bg-green-500'></div>
              Many in stock
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StarIcon({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill={filled ? "currentColor" : "none"}
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}>
      <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
    </svg>
  );
}
