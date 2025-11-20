import { OrderEntity } from "@/api";
import { getAllOrdersForAdminOptions } from "@/api/@tanstack/react-query.gen";
import { orderColumn } from "@/ui/molecules/columns/orderColumn";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/shadcn/dropdown-menu";
import { Input } from "@/ui/shadcn/input";
import { useQuery } from "@tanstack/react-query";
import { Filter, Loader, Search } from "lucide-react";
import { useState } from "react";

const OrderList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const {
    data: orders,
    isLoading: isOrdersLoading,
    error,
    refetch,
  } = useQuery({
    ...getAllOrdersForAdminOptions({
      query: {
        search: searchQuery,
        page: pagination.pageIndex + 1,
      },
    }),
  });

  console.log("Orders data:", orders);

  const pageCount = orders?.data?.total
    ? Math.ceil(orders.data.total / pagination.pageSize)
    : 0;
  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            A comprehensive list of all registered orders
            {orders?.data?.total && (
              <span className="ml-2">(Total: {orders.data.total})</span>
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
              // onClick={() => {
              //   setSortBy("joinedAt");
              //   setOrder("desc");
              // }}
              >
                Newest
              </DropdownMenuItem>

              <DropdownMenuItem
              // onClick={() => {
              //   setSortBy("joinedAt");
              //   setOrder("asc");
              // }}
              >
                Oldest
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort By Name</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
              // onClick={() => {
              //   setSortBy("name");
              //   setOrder("asc");
              // }}
              >
                Ascending
              </DropdownMenuItem>

              <DropdownMenuItem
              // onClick={() => {
              //   setSortBy("name");
              //   setOrder("desc");
              // }}
              >
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <CardContent>
          <div className="space-y-4">
            {isOrdersLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-6 w-6 animate-spin text-primary" />
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

            {!isOrdersLoading && !error && (
              <DataTable
                columns={orderColumn()}
                data={(orders?.data?.data as OrderEntity[]) || []}
                pagination={pagination}
                onPaginationChange={setPagination}
                pageCount={pageCount}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OrderList;
