import { getAllOrdersOptions } from "@/api/@tanstack/react-query.gen";

import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Card, CardContent, CardHeader } from "@/ui/shadcn/card";
import { getImageUrl } from "@/utils/urlHelpers";
import { Separator } from "@radix-ui/react-separator";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Package } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/select";

import { Truck, Store, Filter } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/ui/shadcn/tabs";

const OrderPage = () => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [deliveryFilter, setDeliveryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const {
    data: ordersResponse,
    isPending,
    error,
  } = useQuery({
    ...getAllOrdersOptions(),
  });

  console.log("ordersResponse:", ordersResponse);

  // Add this helper function at the top of your component
  const formatOrderId = (uuid: string) => {
    // Take last 6 characters of UUID and convert to uppercase
    const shortId = uuid.slice(-6).toUpperCase();
    // Add prefix and format with hyphen
    return `ORD-${shortId}`;
  };

  // Normalize array
  let ordersArray: any[] = [];
  if (Array.isArray(ordersResponse?.data)) {
    ordersArray = ordersResponse!.data;
  } else if (Array.isArray((ordersResponse as any)?.data?.records)) {
    ordersArray = (ordersResponse as any).data.records;
  } else if (
    ordersResponse &&
    (ordersResponse as any).data &&
    Array.isArray((ordersResponse as any).data.orders)
  ) {
    ordersArray = (ordersResponse as any).data.orders;
  }
  // Filter and sort orders
  const filteredOrders = ordersArray
    .filter((order) => {
      if (deliveryFilter === "all") return true;
      return order.deliveryMethod === deliveryFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "highest":
          return b.amount - a.amount;
        case "lowest":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NPR",
    }).format(price);

  if (isPending) {
    return (
      <div className="p-8 text-sm text-muted-foreground">Loading orders...</div>
    );
  }
  if (error) {
    return (
      <div className="p-8 text-sm text-destructive">Failed to load orders</div>
    );
  }

  return (
    <div className="w-full flex-1 bg-background min-h-screen">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your orders and track their status
              </p>
            </div>

            {/* Filters Section */}
            <div className="flex flex-wrap items-center gap-4">
              <Tabs
                defaultValue="all"
                value={deliveryFilter}
                onValueChange={setDeliveryFilter}
                className="w-full md:w-auto"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>All</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="delivery"
                    className="flex items-center gap-2"
                  >
                    <Truck className="h-4 w-4" />
                    <span>Delivery</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="pickup"
                    className="flex items-center gap-2"
                  >
                    <Store className="h-4 w-4" />
                    <span>Pickup</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest">Highest Amount</SelectItem>
                  <SelectItem value="lowest">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Orders Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredOrders.length} of {ordersArray.length} orders
          </div>
          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    {/* Left side */}
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {formatOrderId(order.id)}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.createdAt)}
                        </div>
                        <Badge
                          variant="secondary"
                          className="mt-2 flex items-center gap-1"
                        >
                          {order.deliveryMethod === "delivery" ? (
                            <Truck className="h-3 w-3" />
                          ) : (
                            <Store className="h-3 w-3" />
                          )}
                          {order.deliveryMethod === "delivery"
                            ? "Home Delivery"
                            : "Store Pickup"}
                        </Badge>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium text-foreground">
                          {formatPrice(order.amount || 0)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() =>
                            setExpandedOrderId(
                              expandedOrderId === order.id ? null : order.id
                            )
                          }
                        >
                          {expandedOrderId === order.id ? (
                            <div className="flex items-center gap-2">
                              <span>Hide Details</span>
                              <ChevronUp className="h-4 w-4" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>View Details</span>
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Expanded Content */}
                {expandedOrderId === order.id && (
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">
                        Order Items
                      </h4>
                      {Array.isArray(order.itemsSnapShot) &&
                        order.itemsSnapShot.map((item: any, idx: number) => (
                          <div
                            key={item.id || idx}
                            className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
                          >
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md bg-muted"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-foreground">
                                {item.name}
                              </h5>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span>Color: {item.color || "—"}</span>
                                <span>Size: {item.size || "—"}</span>
                                <span>Qty: {item.quantity ?? 1}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-foreground">
                                {formatPrice(item.price || 0)}
                              </div>
                            </div>
                          </div>
                        ))}

                      <div className="flex justify-between items-center pt-4 border-t border-border">
                        <span className="font-medium text-foreground">
                          Order Total
                        </span>
                        <span className="text-xl font-semibold text-foreground">
                          {formatPrice(order.amount || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {ordersArray.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No orders yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  You haven't placed any orders yet. Start shopping to see your
                  orders here.
                </p>
                <Button>Start Shopping</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderPage;
