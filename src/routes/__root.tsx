import { AuthProvider } from "@/context/authContext";
import { Button } from "@/ui/shadcn/button";

import {
  createRootRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { Home, Package, ShoppingBag } from "lucide-react";

export const Route = createRootRoute({
  component: () => (
    <>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </>
  ),
  notFoundComponent: () => {
    const navigate = useNavigate();
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-xl w-full space-y-8 text-center">
          {/* Animated 404 */}
          <div className="relative h-64 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-primary/10 rounded-2xl w-20 h-20 animate-pulse" />
                <div className="bg-primary/20 rounded-2xl w-20 h-20 animate-pulse [animation-delay:200ms]" />
                <div className="bg-primary/10 rounded-2xl w-20 h-20 animate-pulse [animation-delay:400ms]" />
              </div>
            </div>
            <h1 className="text-9xl font-black text-primary/20 animate-pulse">
              404
            </h1>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Lost in Space</h2>
            <p className="text-muted-foreground text-lg">
              This page took a wrong turn at the internet highway.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="mr-2 h-5 w-5" />
                Home
              </Button>
            </Link>

            <Link to="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
            </Link>
          </div>

          {/* Popular Products */}
          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              While you're here, check out our popular items:
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted rounded-lg flex items-center justify-center hover:bg-muted/70 transition-colors cursor-pointer"
                  onClick={() => navigate({ to: "/" })}
                >
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
