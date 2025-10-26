import { Clock, LogIn, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/ui/shadcn/alert";
import { Button } from "@/ui/shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/ui/shadcn/card";
import { Badge } from "@/ui/shadcn/badge";
import { useNavigate } from "@tanstack/react-router";

interface SessionExpiredProps {
  onLogin?: () => void;
  onRefresh?: () => void;
  userEmail?: string;
  lastActivity?: string;
  showOverlay?: boolean;
}

export default function SessionExpired({
  showOverlay = true,
}: SessionExpiredProps) {
  const navigate = useNavigate();
  return (
    <div
      className={`${showOverlay ? "fixed inset-0 z-50 flex items-center justify-center" : "flex items-center justify-center min-h-screen"}`}>
      {showOverlay && (
        <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' />
      )}

      <Card className='relative w-full max-w-md mx-4 shadow-2xl border-0 bg-white/95 backdrop-blur-sm'>
        <CardHeader className='text-center space-y-4 pb-4'>
          <div className='mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center'>
            <Clock className='w-8 h-8 text-orange-600' />
          </div>

          <div className='space-y-2'>
            <Badge
              variant='outline'
              className='bg-orange-50 text-orange-700 border-orange-200'>
              <Shield className='w-3 h-3 mr-1' />
              Security Notice
            </Badge>
            <CardTitle className='text-2xl font-bold text-gray-900'>
              Session Expired
            </CardTitle>
            <CardDescription className='text-gray-600 text-base leading-relaxed'>
              Your session has expired for security reasons. Please log in again
              to continue using the application.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-4 px-6'>
          <Alert className='border-orange-200 bg-orange-50'>
            <AlertDescription className='text-orange-800 text-sm'>
              For your security, we automatically log you out after periods of
              inactivity.
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className='flex flex-col sm:flex-row gap-3 pt-6'>
          <Button
            className='w-full sm:flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5'
            onClick={() => navigate({ to: "/auth/login" })}>
            <LogIn className='w-4 h-4 mr-2' />
            Log In Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
