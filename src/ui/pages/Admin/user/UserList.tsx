import { UserEntity } from "@/api";
import { getAllUsersOptions } from "@/api/@tanstack/react-query.gen";
import { userColumn } from "@/ui/molecules/columns/userColumn";
import { DataTable } from "@/ui/organisms/table/DataTable";
import { Button } from "@/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/card";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/shadcn/dropdown-menu";
import { Input } from "@/ui/shadcn/input";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import {
  Filter,
  Loader2,
  Search,
  TrendingUp,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import { useState } from "react";

// Mock stats - replace with real data
const stats = {
  total: 2847,
  active: 2456,
  inactive: 391,
  growth: 12.5,
};

const UserList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: users,
    isLoading: isUserLoading,
    refetch,
    error,
  } = useQuery({
    ...getAllUsersOptions(),
  });

  console.log("users list", users);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col gap-6">
            {/* Title and Action Buttons */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  User Management
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Manage and monitor all users across your platform
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Users
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        {stats.total.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Users
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        {stats.active.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-chart-2/10 p-3">
                      <UserCheck className="h-5 w-5 text-chart-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Inactive Users
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        {stats.inactive.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <UserX className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Growth Rate
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-foreground">
                        +{stats.growth}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-chart-3/10 p-3">
                      <TrendingUp className="h-5 w-5 text-chart-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto ">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              A comprehensive list of all registered users
            </CardDescription>
          </CardHeader>

          {/* Search and Filters */}
          <div className="flex p-4 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>All Users</DropdownMenuItem>
                <DropdownMenuItem>Active</DropdownMenuItem>
                <DropdownMenuItem>Inactive</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Admin</DropdownMenuItem>
                <DropdownMenuItem>User</DropdownMenuItem>
                <DropdownMenuItem>Guest</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardContent>
            <div className="space-y-4">
              {isUserLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-destructive">
                      Error: {error.message}
                    </p>
                    <Button
                      onClick={() => refetch()}
                      variant="destructive"
                      size="sm"
                    >
                      Retry Now
                    </Button>
                  </div>
                </div>
              )}

              {!isUserLoading && !error && (
                <DataTable
                  columns={userColumn}
                  data={(users?.data?.data as UserEntity[]) || []}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserList;
