import { getCurrentUserOptions } from "@/api/@tanstack/react-query.gen";
import { EditDialog } from "@/ui/molecules/dialogs/EditDialog";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Card, CardContent } from "@/ui/shadcn/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/ui/shadcn/tooltip";

import { useQuery } from "@tanstack/react-query";
import { User, Mail, Edit, Info } from "lucide-react";
import { useState } from "react";

// ✅ Add Type Definition
interface CustomerData {
  email: string;
  fullName: string;
  role: string;
  tokenVersion: number;
  userId: string;
  isOauth?: boolean;
  provider?: string | null;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export function CustomerProfile() {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { data: user, isPending: isUserLoading } = useQuery({
    ...getCurrentUserOptions(),
  });

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const customer = user?.data as CustomerData | undefined;

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <p className="text-sm text-destructive">Failed to load profile</p>
        </div>
      </div>
    );
  }

  console.log("Customer Profile Data:", customer);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <div className="h-6 w-px bg-gray-300" />
                <div className="heading">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-transparent">
                    Profile
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Manage your personal information and settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-6 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Profile Header Card */}
        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 md:gap-6 w-full sm:w-auto">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                      {customer.fullName || "User"}
                    </h1>
                  </div>
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground break-all">
                    {customer.email || "user@example.com"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  disabled={customer.isOauth}
                  onClick={() => setOpenEditDialog(true)}
                  className="gap-2 hover:bg-green-700 text-white border-0 flex-1 sm:flex-none text-sm sm:text-base"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  Edit Profile
                </Button>
                {customer.isOauth && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 cursor-pointer text-yellow-500 flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs sm:text-sm max-w-xs p-2">
                          You signed up with Google. Some details like your
                          email, name are managed by Google and can't be changed
                          here, but you can update them in your Google account
                          settings if needed and they will sync here. Be
                          cautious when changing your information in Google as
                          it may affect your login access to this app.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="shadow-sm border-0 bg-white">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">
                Profile Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Full Name */}
              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground mb-1">
                    Full Name
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {customer.fullName || "User"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground mb-1">
                    Email Address
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm sm:text-base text-muted-foreground truncate">
                      {customer.email || "user@example.com"}
                    </p>
                    {customer.isEmailVerified && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs bg-green-100 text-green-700 hover:bg-green-100 flex-shrink-0"
                      >
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Login Method */}
              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  {customer.isOauth ? (
                    <img
                      src={
                        customer.provider === "google"
                          ? "https://www.svgrepo.com/show/355037/google.svg"
                          : customer.provider === "github"
                            ? "https://www.svgrepo.com/show/512317/github-142.svg"
                            : "https://www.svgrepo.com/show/452213/user.svg"
                      }
                      alt={customer.provider || "user"}
                      className="h-4 w-4 sm:h-5 sm:w-5"
                    />
                  ) : (
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-foreground mb-1">
                    Login Method
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipContent
                        side="right"
                        className="max-w-xs text-xs sm:text-sm"
                      >
                        <p>
                          This indicates how you created your account. If it
                          says Google, you log in with your Google account.
                          Otherwise, you use your email and password.
                        </p>
                      </TooltipContent>
                      <div className="flex items-center gap-2">
                        <p className="text-sm sm:text-base text-muted-foreground capitalize">
                          {customer.isOauth
                            ? `${customer.provider} Account`
                            : "Email & Password"}
                        </p>
                        <Badge
                          variant="secondary"
                          className="text-[10px] sm:text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        >
                          {customer.isOauth ? "OAuth" : "Local"}
                        </Badge>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        {customer.isOauth
                          ? `You signed up using your ${customer.provider} account.`
                          : "You signed up with your email and password."}
                      </p>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog Component */}
      <EditDialog
        open={openEditDialog}
        setOpen={setOpenEditDialog}
        userInfo={customer}
      />
    </div>
  );
}
