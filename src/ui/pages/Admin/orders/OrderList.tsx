import { OrderEntity } from "@/api";
import { getAllOrdersForAdminOptions } from "@/api/@tanstack/react-query.gen";
import { orderColumn } from "@/ui/molecules/columns/orderColumn";
import { DataTable } from "@/ui/organisms/table/DataTable";
import { Button } from "@/ui/shadcn/button";
import { Badge } from "@/ui/shadcn/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shadcn/card";
import { Input } from "@/ui/shadcn/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shadcn/popover";
import { Separator } from "@/ui/shadcn/separator";
import { Tabs, TabsList, TabsTrigger } from "@/ui/shadcn/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  Loader,
  Search,
  X,
  Check,
  ArrowUpDown,
  Truck,
  Circle,
  Filter,
  PlusCircle,
  CalendarIcon,
} from "lucide-react";
import { useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cn } from "@/lib/utils";

const OrderList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<
    "delivery" | "pickup" | null
  >(null);
  const [status, setStatus] = useState<
    "new" | "processing" | "completed" | "cancelled" | null
  >(null);
  const [sortBy, setSortBy] = useState<"date" | "newest" | "oldest">("date");

  // Quick View Tabs State
  const [activeTab, setActiveTab] = useState("all");

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Handle Tab Change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") setStatus(null);
    else setStatus(value as any);
    setPagination({ ...pagination, pageIndex: 0 });
  };

  const {
    data: orders,
    isLoading: isOrdersLoading,
    error,
    refetch,
  } = useQuery({
    ...getAllOrdersForAdminOptions({
      query: {
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy: sortBy === "newest" || sortBy === "oldest" ? "date" : "date",
        sortOrder: sortBy === "oldest" ? "ASC" : "DESC",
        ...(deliveryMethod && { deliveryMethod }),
        ...(status && { status }),
      },
    }),
  });

  const pageCount = orders?.data?.total
    ? Math.ceil(orders.data.total / pagination.pageSize)
    : 0;

  const isFiltered =
    deliveryMethod || status || searchQuery || sortBy !== "date";

  const clearAll = () => {
    setDeliveryMethod(null);
    setStatus(null);
    setSortBy("date");
    setSearchQuery("");
    setActiveTab("all");
  };

  // --- REUSABLE FACETED FILTER COMPONENT ---
  const FacetedFilter = ({
    title,
    icon: Icon,
    options,
    value,
    onChange,
  }: {
    title: string;
    icon?: any;
    options: { label: string; value: string; icon?: any }[];
    value: string | null;
    onChange: (val: string | null) => void;
  }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 border-dashed",
              value
                ? "bg-accent/50 border-solid border-accent-foreground/30"
                : "hover:bg-accent/50"
            )}
          >
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {title}
            {value && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  1
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal bg-background"
                  >
                    {options.find((opt) => opt.value === value)?.label}
                  </Badge>
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <div className="p-1">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    isSelected && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => onChange(isSelected ? null : option.value)}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  {option.icon && (
                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{option.label}</span>
                </div>
              );
            })}
          </div>
          {value && (
            <>
              <Separator />
              <div className="p-1">
                <div
                  className="flex w-full cursor-pointer items-center justify-center rounded-sm py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  onClick={() => onChange(null)}
                >
                  Clear filter
                </div>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Order Management
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Manage and monitor all orders across your platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          {/* TOOLBAR */}
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-center bg-background/50">
            <div className="flex flex-1 items-between space-x-2">
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by name, email or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-8 w-full"
                />
              </div>

              {/* STATUS FILTER (Only show if "All" tab is active to avoid conflict) */}
              {activeTab === "all" && (
                <FacetedFilter
                  title="Status"
                  icon={PlusCircle}
                  value={status}
                  onChange={(val) => setStatus(val as any)}
                  options={[
                    { label: "New", value: "new", icon: Circle },
                    { label: "Processing", value: "processing", icon: Circle },
                    { label: "Completed", value: "completed", icon: Circle },
                    { label: "Cancelled", value: "cancelled", icon: Circle },
                  ]}
                />
              )}

              {/* DELIVERY FILTER */}
              <FacetedFilter
                title="Delivery"
                icon={Truck}
                value={deliveryMethod}
                onChange={(val) => setDeliveryMethod(val as any)}
                options={[
                  { label: "Delivery", value: "delivery" },
                  { label: "Pickup", value: "pickup" },
                ]}
              />

              {/* SORT FILTER */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-dashed"
                  >
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort
                    {sortBy !== "date" && (
                      <>
                        <Separator
                          orientation="vertical"
                          className="mx-2 h-4"
                        />
                        <Badge
                          variant="secondary"
                          className="rounded-sm px-1 font-normal bg-background"
                        >
                          {sortBy === "newest" ? "Newest" : "Oldest"}
                        </Badge>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[180px] p-1" align="start">
                  <div
                    className={cn(
                      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      (sortBy === "date" || sortBy === "newest") && "bg-accent"
                    )}
                    onClick={() => setSortBy("newest")}
                  >
                    Newest First
                  </div>
                  <div
                    className={cn(
                      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      sortBy === "oldest" && "bg-accent"
                    )}
                    onClick={() => setSortBy("oldest")}
                  >
                    Oldest First
                  </div>
                </PopoverContent>
              </Popover>

              {/* RESET BUTTON */}
              {isFiltered && (
                <Button
                  variant="ghost"
                  onClick={clearAll}
                  className="h-8 px-2 lg:px-3"
                >
                  Reset
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* TABLE */}
          <div className="border-t">
            {isOrdersLoading && (
              <div className="flex items-center justify-center py-24">
                <Loader className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-destructive/10 p-3 mb-4">
                  <X className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="font-semibold text-lg">Error loading orders</h3>
                <p className="text-muted-foreground mb-4 max-w-xs">
                  {error.message ||
                    "Something went wrong while fetching the data."}
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
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
    </div>
  );
};

export default OrderList;
