import { Button } from "../shadcn/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../shadcn/navigation-menu";
import { Heart, Menu, Search, Sheet, ShoppingBag, User, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "../shadcn/input";
import { SheetTrigger, SheetContent, SheetClose } from "../shadcn/sheet";
import { Link } from "@tanstack/react-router";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2'>
          <ShoppingBag className='h-6 w-6' />
          <span className='text-xl font-bold'>LuxuryBags</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className='hidden md:flex'>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to='/'>
                <NavigationMenuLink className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
                  <li className='row-span-3'>
                    <NavigationMenuLink asChild>
                      <Link
                        to='/'
                        className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-rose-500 to-indigo-700 p-6 no-underline outline-none focus:shadow-md'>
                        <div className='mt-4 mb-2 text-lg font-medium text-white'>
                          New Arrivals
                        </div>
                        <p className='text-sm leading-tight text-white/90'>
                          Check out our latest collection of premium bags
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to='/'
                        className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'>
                        <div className='text-sm font-medium leading-none'>
                          Handbags
                        </div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                          Elegant handbags for every occasion
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to='/'
                        className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'>
                        <div className='text-sm font-medium leading-none'>
                          Backpacks
                        </div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                          Stylish and functional backpacks for daily use
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to='/'
                        className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'>
                        <div className='text-sm font-medium leading-none'>
                          Travel Bags
                        </div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                          Durable and spacious bags for your travels
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Collections</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2'>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to='/'
                        className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'>
                        <div className='text-sm font-medium leading-none'>
                          Summer Collection
                        </div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                          Light and colorful bags for the summer season
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to='/'
                        className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'>
                        <div className='text-sm font-medium leading-none'>
                          Luxury Line
                        </div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                          Premium materials and exquisite craftsmanship
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to='/'
                        className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'>
                        <div className='text-sm font-medium leading-none'>
                          Eco-Friendly
                        </div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                          Sustainable bags made from recycled materials
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to='/'
                        className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'>
                        <div className='text-sm font-medium leading-none'>
                          Limited Edition
                        </div>
                        <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
                          Exclusive designs with limited availability
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to='/about'>
                <NavigationMenuLink className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to='/'>
                <NavigationMenuLink className='group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'>
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side icons (leave this section as it was) */}
        {/* ... */}
      </div>
    </header>
  );
}
