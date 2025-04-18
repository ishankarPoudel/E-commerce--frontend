import {
  ShoppingBag,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Input } from "../shadcn/input";
import { Button } from "../shadcn/button";
import { Separator } from "../shadcn/separator";

export default function Footer() {
  return (
    <footer className='bg-background border-t'>
      {/* Newsletter Section */}
      <div className='container mx-auto py-12 px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div>
            <h3 className='text-2xl font-bold mb-2'>Join Our Newsletter</h3>
            <p className='text-muted-foreground'>
              Subscribe to get special offers, free giveaways, and exclusive
              deals.
            </p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3'>
            <Input
              type='email'
              placeholder='Your email address'
              className='flex-1 rounded-full'
            />
            <Button className='rounded-full bg-primary hover:bg-primary/90'>
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Main Footer Content */}
      <div className='container mx-auto py-12 px-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Brand Column */}
          <div className='space-y-4'>
            <a href='/' className='flex items-center gap-2'>
              <ShoppingBag className='h-6 w-6 text-primary' />
              <span className='text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
                LuxuryBags
              </span>
            </a>
            <p className='text-muted-foreground'>
              Crafting premium bags with exceptional quality and timeless design
              since 2010.
            </p>
            <div className='flex gap-4'>
              <a
                href='/'
                className='text-muted-foreground hover:text-primary transition-colors'>
                <Facebook className='h-5 w-5' />
                <span className='sr-only'>Facebook</span>
              </a>
              <a
                href='/'
                className='text-muted-foreground hover:text-primary transition-colors'>
                <Twitter className='h-5 w-5' />
                <span className='sr-only'>Twitter</span>
              </a>
              <a
                href='/'
                className='text-muted-foreground hover:text-primary transition-colors'>
                <Instagram className='h-5 w-5' />
                <span className='sr-only'>Instagram</span>
              </a>
              <a
                href='/'
                className='text-muted-foreground hover:text-primary transition-colors'>
                <Youtube className='h-5 w-5' />
                <span className='sr-only'>YouTube</span>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className='font-medium text-lg mb-4'>Shop</h4>
            <ul className='space-y-3'>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  All Products
                </a>
              </li>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  New Arrivals
                </a>
              </li>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  Handbags
                </a>
              </li>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  Backpacks
                </a>
              </li>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  Travel Bags
                </a>
              </li>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  Accessories
                </a>
              </li>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  Sale
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className='font-medium text-lg mb-4'>Company</h4>
            <ul className='space-y-3'>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  About Us
                </a>
              </li>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  Sustainability
                </a>
              </li>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  Careers
                </a>
              </li>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  Press
                </a>
              </li>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  Blog
                </a>
              </li>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href='/'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className='font-medium text-lg mb-4'>Contact</h4>
            <ul className='space-y-4'>
              <li className='flex items-start gap-3'>
                <MapPin className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                <span className='text-muted-foreground'>
                  123 Fashion Street, Design District, New York, NY 10001
                </span>
              </li>
              <li className='flex items-center gap-3'>
                <Phone className='h-5 w-5 text-primary shrink-0' />
                <a
                  href='tel:+1234567890'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  +1 (234) 567-890
                </a>
              </li>
              <li className='flex items-center gap-3'>
                <Mail className='h-5 w-5 text-primary shrink-0' />
                <a
                  href='mailto:info@luxurybags.com'
                  className='text-muted-foreground hover:text-foreground transition-colors'>
                  info@luxurybags.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className='border-t'>
        <div className='container mx-auto py-6 px-4 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-muted-foreground'>
            © {new Date().getFullYear()} LuxuryBags. All rights reserved.
          </p>
          <div className='flex items-center gap-6'>
            <a
              href='/'
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
              Shipping
            </a>
            <a
              href='/'
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
              Returns
            </a>
            <a
              href='/'
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
              FAQ
            </a>
            <a
              href='/'
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'>
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
