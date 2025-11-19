import { UserEntity } from "@/api";
import {
  banUserMutation,
  getAllUsersOptions,
  unbanUserMutation,
} from "@/api/@tanstack/react-query.gen";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { Filter, Loader2, Search } from "lucide-react";
import { useState, memo } from "react";
import { UserDetailsDialog } from "./UserDetails";
import { toast } from "sonner";

const UserHeader = memo(() => {
  return (
    <div className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col gap-6">
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
        </div>
      </div>
    </div>
  );
});

const UserTableSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "joinedAt">("joinedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    ...getAllUsersOptions({
      query: {
        search: debouncedSearchQuery,
        page: pagination.pageIndex + 1, // backend pages are 1-indexed
        pageSize: pagination.pageSize,
        order,
        sortBy,
      },
    }),
  });

  //mutation to ban/ unban user
  const { mutate: banUser } = useMutation({
    ...banUserMutation(),
  });

  const { mutate: unbanUser } = useMutation({
    ...unbanUserMutation(),
  });

  const pageCount = users?.data?.total
    ? Math.ceil(users.data.total / pagination.pageSize)
    : 0;

  //Handle view details
  const handleViewDetails = (user: UserEntity) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  //handle user ban
  const handleUserBan = (userId: string) => {
    console.log("Ban user with ID:", userId);
    banUser(
      {
        body: {
          userId,
        },
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "User banned successfully");
          refetch();
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to ban user");
        },
      }
    );
  };
  //handle user unban
  const handleUserUnban = (userId: string) => {
    console.log("Unban user with ID:", userId);
    unbanUser(
      {
        body: {
          userId,
        },
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "User unbanned successfully");
          refetch();
        },

        onError: (error: any) => {
          toast.error(error.message || "Failed to unban user");
        },
      }
    );
  };

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A comprehensive list of all registered users
            {users?.data?.total && (
              <span className="ml-2">(Total: {users.data.total})</span>
            )}
          </CardDescription>
        </CardHeader>

        {/* Search */}
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

          {/* Filters dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Joined Date</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("joinedAt");
                  setOrder("desc");
                }}
              >
                Newest
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setSortBy("joinedAt");
                  setOrder("asc");
                }}
              >
                Oldest
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort By Name</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSortBy("name");
                  setOrder("asc");
                }}
              >
                Ascending
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setSortBy("name");
                  setOrder("desc");
                }}
              >
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <CardContent>
          <div className="space-y-4">
            {isLoading && (
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

            {!isLoading && !error && (
              <DataTable
                columns={userColumn(
                  handleViewDetails,
                  handleUserBan,
                  handleUserUnban
                )}
                data={(users?.data?.data as UserEntity[]) || []}
                pagination={pagination}
                onPaginationChange={setPagination}
                pageCount={pageCount}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <UserDetailsDialog
        user={selectedUser}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      />
    </>
  );
};

const UserList = () => {
  return (
    <div className="min-h-screen bg-background">
      <UserHeader />
      <div className="container mx-auto mt-6">
        <UserTableSection />
      </div>
    </div>
  );
};

export default UserList;
