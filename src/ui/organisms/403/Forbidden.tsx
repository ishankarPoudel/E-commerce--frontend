import { Button } from "@/ui/shadcn/button";
import { ShieldAlert } from "lucide-react";
import { Link } from "@tanstack/react-router";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-destructive/10">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground">Access Denied</h1>

        {/* Description */}
        <p className="text-muted-foreground text-lg">
          You don't have permission to access this page.
        </p>

        {/* Error Code */}
        <div className="py-4">
          <span className="text-6xl font-bold text-muted-foreground/20">
            403
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
