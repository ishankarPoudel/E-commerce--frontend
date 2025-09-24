import { getUserByIdOptions } from "@/api/@tanstack/react-query.gen";
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
import { User, Mail, Calendar, Edit, Info } from "lucide-react";
import { useState } from "react";

export function CustomerProfile() {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { data: user, isPending: isUserLoading } = useQuery({
    ...getUserByIdOptions(),
  });
  if (isUserLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className='min-h-screen bg-gray-50/50'>
      <div className='sticky top-0 z-20 bg-white border-b border-gray-200'>
        <div className='bg-white border-b border-gray-200'>
          <div className='max-w-6xl mx-auto px-6 py-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className='h-6 w-px bg-gray-300' />
                <div className='heading'>
                  <h1 className='text-2xl font-bold bg-transparent'>Profile</h1>
                  <p className='text-sm text-muted-foreground'>
                    Manage your personal information and settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-6 py-3 space-y-8'>
        {/* Profile Header Card */}
        <Card className='shadow-sm border-0 bg-white'>
          <CardContent className='p-8'>
            <div className='flex items-start justify-between'>
              <div className='flex items-start gap-6'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-3'>
                    <h1 className='text-3xl font-bold text-foreground'>
                      {user?.data.fullName || "User"}
                    </h1>
                  </div>
                  <p className='text-lg text-muted-foreground'>
                    {user?.data.email || "user@example.com"}
                  </p>
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <span>
                      Member since{" "}
                      {user?.data.createdAt
                        ? new Date(user.data.createdAt).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "long", day: "numeric" }
                          )
                        : "Not available"}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Button
                  disabled={user?.data.isOauth}
                  onClick={() => setOpenEditDialog(true)}
                  className='gap-2 hover:bg-green-700 text-white border-0'>
                  <Edit className='h-4 w-4' />
                  Edit Profile
                </Button>
                {user?.data.isOauth && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className='h-4 w-4 cursor-pointer text-yellow-500' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className='text-sm text-break-word max-w-xs border-4p-2 '>
                          You signed up with Google. Some details like your
                          email, name are managed by Google and can’t be changed
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
        <Card className='shadow-sm border-0 bg-white'>
          <CardContent className='p-8'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-semibold text-foreground'>
                Profile Information
              </h2>
              <Button
                variant='ghost'
                size='sm'
                className='text-muted-foreground hover:text-foreground'>
                Last updated{" "}
                {user?.data.updatedAt
                  ? new Date(user.data.updatedAt).toLocaleDateString()
                  : "Not available"}
              </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Full Name */}
              <div className='flex items-start gap-4 p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors'>
                <div className='flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                  <User className='h-5 w-5 text-blue-600' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-foreground mb-1'>
                    Full Name
                  </p>
                  <p className='text-base text-muted-foreground'>
                    {user?.data.fullName || "User"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className='flex items-start gap-4 p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors'>
                <div className='flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                  <Mail className='h-5 w-5 text-green-600' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-foreground mb-1'>
                    Email Address
                  </p>
                  <div className='flex items-center gap-2'>
                    <p className='text-base text-muted-foreground truncate'>
                      {user?.data.email || "user@example.com"}
                    </p>
                    {user?.data.isEmailVerified && (
                      <Badge
                        variant='secondary'
                        className='text-xs bg-green-100 text-green-700 hover:bg-green-100 flex-shrink-0'>
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Login Method */}
              <div className='flex items-start gap-4 p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors'>
                <div className='flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center'>
                  {user?.data.isOauth ? (
                    <img
                      src={
                        user?.data.provider === "google"
                          ? "https://www.svgrepo.com/show/355037/google.svg"
                          : user?.data.provider === "github"
                            ? "https://www.svgrepo.com/show/512317/github-142.svg"
                            : "https://www.svgrepo.com/show/452213/user.svg" // fallback generic user icon
                      }
                      alt={user?.data.provider}
                      className='h-5 w-5'
                    />
                  ) : (
                    <Mail className='h-5 w-5 text-yellow-600' />
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-foreground mb-1'>
                    Login Method
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipContent side='right' className='max-w-xs text-sm'>
                        <p>
                          This indicates how you created your account. If it
                          says Google, you log in with your Google account.
                          Otherwise, you use your email and password.
                        </p>
                      </TooltipContent>
                      <div className='flex items-center gap-2'>
                        <p className='text-base text-muted-foreground capitalize'>
                          {user?.data.isOauth
                            ? `${user?.data.provider} Account`
                            : "Email & Password"}
                        </p>
                        <Badge
                          variant='secondary'
                          className='text-xs bg-yellow-100 text-yellow-700 hover:bg-yellow-100'>
                          {user?.data.isOauth ? "OAuth" : "Local"}
                        </Badge>
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {user?.data.isOauth
                          ? `You signed up using your ${user?.data.provider} account.`
                          : "You signed up with your email and password."}
                      </p>
                      <TooltipTrigger asChild>
                        <Info className='h-4 w-4 text-muted-foreground cursor-pointer' />
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Join Date */}
              <div className='flex items-start gap-4 p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors'>
                <div className='flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
                  <Calendar className='h-5 w-5 text-orange-600' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-foreground mb-1'>
                    Member Since
                  </p>
                  <p className='text-base text-muted-foreground'>
                    {user?.data.createdAt
                      ? new Date(user.data.createdAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "long", day: "numeric" }
                        )
                      : "Not available"}
                  </p>
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
        userInfo={user?.data}
      />
    </div>
  );
}
