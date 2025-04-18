"use client";

import { useState } from "react";
import { Search, ShoppingBag, User, Heart, Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/ui/shadcn/navigation-menu";

import { Link } from "@tanstack/react-router";
import { Input } from "../shadcn/input";
import { Button } from "../shadcn/button";
import { Sheet, SheetContent, SheetTrigger } from "../shadcn/sheet";
import Logo from "../atoms/Logo";

export default function Navbar() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2'>
          <Logo />
        </Link>

        {/* Search Bar - Always visible on desktop */}
        <div className='hidden md:block relative w-1/3 mx-4'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search for luxury bags...'
            className='w-full pl-10 rounded-full border-muted bg-background/50 focus-visible:ring-primary'
          />
        </div>

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
              <NavigationMenuTrigger className='text-sm font-medium'>
                Shop
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
                  <li className='row-span-3'>
                    <NavigationMenuLink asChild>
                      <Link
                        to='/'
                        className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-br from-primary to-primary/60 p-6 no-underline outline-none focus:shadow-md'>
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
              <NavigationMenuTrigger className='text-sm font-medium'>
                Collections
              </NavigationMenuTrigger>
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

        {/* Right side icons */}
        <div className='flex items-center gap-1 md:gap-2'>
          {/* Mobile Search Toggle */}
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}>
            {isSearchExpanded ? (
              <X className='h-5 w-5' />
            ) : (
              <Search className='h-5 w-5' />
            )}
          </Button>

          {/* Wishlist */}
          <Button
            variant='ghost'
            size='icon'
            className='hidden md:flex'
            asChild>
            <Link to='/'>
              <Heart className='h-5 w-5 text-muted-foreground hover:text-foreground transition-colors' />
              <span className='sr-only'>Wishlist</span>
            </Link>
          </Button>

          {/* User Account */}
          <Button
            variant='ghost'
            size='icon'
            className='hidden md:flex'
            asChild>
            <Link to='/'>
              <User className='h-5 w-5 text-muted-foreground hover:text-foreground transition-colors' />
              <span className='sr-only'>Account</span>
            </Link>
          </Button>

          {/* Shopping Cart */}
          <Button variant='ghost' size='icon' className='relative' asChild>
            <Link to='/'>
              <ShoppingBag className='h-5 w-5 text-muted-foreground hover:text-foreground transition-colors' />
              <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground'>
                3
              </span>
              <span className='sr-only'>Shopping Cart</span>
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
                <span className='sr-only'>Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[80%] sm:w-[350px]'>
              <div className='flex flex-col h-full'>
                <div className='flex items-center gap-2 py-4 border-b'>
                  <ShoppingBag className='h-6 w-6 text-primary' />
                  <span className='text-xl font-bold'>LuxuryBags</span>
                </div>

                <nav className='flex flex-col gap-1 py-4'>
                  <Link
                    to='/'
                    className='px-2 py-3 text-lg font-medium hover:bg-accent rounded-md'>
                    Home
                  </Link>
                  <div className='px-2 py-3 text-lg font-medium'>
                    Shop
                    <div className='mt-2 pl-4 flex flex-col gap-2'>
                      <Link
                        to='/'
                        className='text-sm text-muted-foreground hover:text-foreground'>
                        Handbags
                      </Link>
                      <Link
                        to='/'
                        className='text-sm text-muted-foreground hover:text-foreground'>
                        Backpacks
                      </Link>
                      <Link
                        to='/'
                        className='text-sm text-muted-foreground hover:text-foreground'>
                        Travel Bags
                      </Link>
                    </div>
                  </div>
                  <div className='px-2 py-3 text-lg font-medium'>
                    Collections
                    <div className='mt-2 pl-4 flex flex-col gap-2'>
                      <Link
                        to='/'
                        className='text-sm text-muted-foreground hover:text-foreground'>
                        Summer Collection
                      </Link>
                      <Link
                        to='/'
                        className='text-sm text-muted-foreground hover:text-foreground'>
                        Luxury Line
                      </Link>
                      <Link
                        to='/'
                        className='text-sm text-muted-foreground hover:text-foreground'>
                        Eco-Friendly
                      </Link>
                    </div>
                  </div>
                  <Link
                    to='/about'
                    className='px-2 py-3 text-lg font-medium hover:bg-accent rounded-md'>
                    About
                  </Link>
                  <Link
                    to='/'
                    className='px-2 py-3 text-lg font-medium hover:bg-accent rounded-md'>
                    Contact
                  </Link>
                </nav>

                <div className='mt-auto border-t py-4'>
                  <div className='flex gap-4'>
                    <Link to='/' className='flex items-center gap-2 text-sm'>
                      <User className='h-4 w-4' />
                      Account
                    </Link>
                    <Link to='/' className='flex items-center gap-2 text-sm'>
                      <Heart className='h-4 w-4' />
                      Wishlist
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar - Expandable */}
      {isSearchExpanded && (
        <div className='border-t p-3 md:hidden'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search for luxury bags...'
              className='w-full pl-10 rounded-full border-muted'
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}
