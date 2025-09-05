import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Card, CardContent } from "@/ui/shadcn/card";

import { User, Mail, Phone, Calendar, Edit } from "lucide-react";

// Mock user data - in a real app this would come from props or API
const userData = {
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "+1 (555) 123-4567",
  joinDate: "March 15, 2023",
  avatar: "/professional-woman-avatar.png",
  emailVerified: true,
};

export function CustomerProfile() {
  return (
    <div className='min-h-screen bg-gray-50/50'>
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-6xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='h-6 w-px bg-gray-300' />
              <div>
                <h1 className='text-2xl font-bold text-foreground'>Profile</h1>
                <p className='text-sm text-muted-foreground'>
                  Manage your personal information and settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-6 py-8 space-y-8'>
        {/* Profile Header Card */}
        <Card className='shadow-sm border-0 bg-white'>
          <CardContent className='p-8'>
            <div className='flex items-start justify-between'>
              <div className='flex items-start gap-6'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-3'>
                    <h1 className='text-3xl font-bold text-foreground'>
                      {userData.name}
                    </h1>
                  </div>
                  <p className='text-lg text-muted-foreground'>
                    {userData.email}
                  </p>
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <span>{userData.phone}</span>
                    <span>•</span>
                    <span>Member since {userData.joinDate}</span>
                  </div>
                  <div className='flex items-center gap-6 mt-4 pt-4 border-t border-gray-100'>
                    <div className='text-center'>
                      <p className='text-2xl font-bold text-foreground'>24</p>
                      <p className='text-xs text-muted-foreground'>Orders</p>
                    </div>
                    <div className='text-center'>
                      <p className='text-2xl font-bold text-foreground'>
                        $2,847
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        Total Spent
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <Button className='gap-2 hover:bg-green-700 text-white border-0'>
                  <Edit className='h-4 w-4' />
                  Edit Profile
                </Button>
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
                Last updated 2 hours ago
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
                    {userData.name}
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
                      {userData.email}
                    </p>
                    {userData.emailVerified && (
                      <Badge
                        variant='secondary'
                        className='text-xs bg-green-100 text-green-700 hover:bg-green-100 flex-shrink-0'>
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className='flex items-start gap-4 p-4 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors'>
                <div className='flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                  <Phone className='h-5 w-5 text-purple-600' />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-foreground mb-1'>
                    Phone Number
                  </p>
                  <p className='text-base text-muted-foreground'>
                    {userData.phone}
                  </p>
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
                    {userData.joinDate}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
