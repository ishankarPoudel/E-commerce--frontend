import { AuthProvider } from "@/context/authContext";
import { Button } from "@/ui/shadcn/button";

import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Home } from "lucide-react";

export const Route = createRootRoute({
  component: () => (
    <>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </>
  ),
  notFoundComponent: () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-xl w-full space-y-10 text-center">
          {/* Animated 404 */}
          <div className="relative h-64 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-primary/10 rounded-2xl w-20 h-20 animate-pulse" />
                <div className="bg-primary/20 rounded-2xl w-20 h-20 animate-pulse [animation-delay:200ms]" />
                <div className="bg-primary/10 rounded-2xl w-20 h-20 animate-pulse [animation-delay:400ms]" />
              </div>
            </div>

            <h1 className="text-9xl font-black text-primary/20 tracking-tight">
              404
            </h1>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Page not found</h2>
            <p className="text-muted-foreground text-lg">
              Looks like the page you’re looking for doesn’t exist or was moved.
            </p>
          </div>

          {/* Recovery Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>

          {/* Helpful Hint */}
          <div className="pt-6 border-t space-y-3">
            <p className="text-sm text-muted-foreground">
              If you typed the URL manually, double-check the spelling.
            </p>
            <p className="text-sm text-muted-foreground">
              Still lost? Our homepage is a good place to restart.
            </p>
          </div>
        </div>
      </div>
    );
  },
});
