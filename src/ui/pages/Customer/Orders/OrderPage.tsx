import { getAllOrdersOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/ui/shadcn/card";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/select";
import { Tabs, TabsList, TabsTrigger } from "@/ui/shadcn/tabs";

import {
  Calendar,
  Package,
  Store,
  Truck,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Separator } from "@/ui/shadcn/separator";

const OrderPage = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const {
    data: ordersResponse,
    isPending,
    error,
  } = useQuery({
    ...getAllOrdersOptions(),
  });

  console.log("ordersResponse", ordersResponse);

  // Normalize incoming data
  let orders = [] as any[];
  if (Array.isArray(ordersResponse?.data)) orders = ordersResponse.data;
  else if (Array.isArray(ordersResponse?.data)) orders = ordersResponse.data;
  else if (Array.isArray(ordersResponse?.data?.orders))
    orders = ordersResponse.data.orders;

  const formatOrderId = (id: string) => `ORD-${id.slice(-6).toUpperCase()}`;
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const filtered = orders
    .filter((o) =>
      deliveryFilter === "all" ? true : o.deliveryMethod === deliveryFilter,
    )
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

  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Package className="h-10 w-10 md:h-12 md:w-12 mx-auto animate-pulse text-muted-foreground" />
          <p className="text-sm md:text-base text-muted-foreground">
            Loading orders…
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Package className="h-10 w-10 md:h-12 md:w-12 mx-auto text-destructive" />
          <p className="text-sm md:text-base text-destructive">
            Failed to load orders
          </p>
        </div>
      </div>
    );

  return (
    <div className="w-full flex-1 bg-background min-h-screen">
      <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-10 space-y-4 sm:space-y-6 md:space-y-10">
        <section className="space-y-1 md:space-y-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            Review your past purchases and track order status.
          </p>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                Total Orders
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-1">
                {orders.length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                Pending
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-1">
                {orders.filter((x) => x.status === "pending").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                Paid
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-1">
                {orders.filter((x) => x.status === "paid").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                Total Spent
              </p>
              <p className="text-base sm:text-lg md:text-xl font-semibold mt-1 truncate">
                रु {orders.reduce((sum, x) => sum + (x.amount || 0), 0)}
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          {/* Delivery Filter */}
          <Tabs
            value={deliveryFilter}
            onValueChange={setDeliveryFilter}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-3 w-full h-9 sm:h-10">
              <TabsTrigger
                value="all"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">All</span>
              </TabsTrigger>

              <TabsTrigger
                value="delivery"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Delivery</span>
              </TabsTrigger>

              <TabsTrigger
                value="pickup"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Store className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Pickup</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Sort - Mobile Full Width */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px] h-9 sm:h-10 text-xs sm:text-sm">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Amount</SelectItem>
              <SelectItem value="lowest">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </section>

        {/* Results Count */}
        <div className="text-xs sm:text-sm text-muted-foreground">
          Showing {filtered.length} of {orders.length} orders
        </div>

        <section className="space-y-3 sm:space-y-4 md:space-y-5">
          {filtered.map((order: any) => {
            const isOpen = expanded === order.id;

            return (
              <Card
                key={order.id}
                className="border rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    {/* Left - Order Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                        <h3 className="font-semibold text-sm sm:text-base">
                          {formatOrderId(order.id)}
                        </h3>
                        <p className="font-semibold text-sm sm:text-base sm:hidden">
                          रु {order.amount}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {formatDate(order.createdAt)}
                      </div>

                      <Badge
                        variant="secondary"
                        className="inline-flex items-center gap-1.5 text-xs w-fit"
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

                    {/* Right - Price & Button */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:gap-3">
                      <p className="font-semibold text-base sm:text-lg hidden sm:block">
                        रु {order.amount}
                      </p>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs sm:text-sm h-8 sm:h-9"
                        onClick={() => setExpanded(isOpen ? null : order.id)}
                      >
                        {isOpen ? (
                          <>
                            Hide{" "}
                            <ChevronUp className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                          </>
                        ) : (
                          <>
                            Details{" "}
                            <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isOpen && (
                  <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                    <Separator className="mb-4" />

                    <h4 className="font-medium text-sm sm:text-base mb-3 sm:mb-4">
                      Order Items
                    </h4>

                    {/* Order Items List */}
                    <div className="space-y-3 sm:space-y-4">
                      {order.itemsSnapShot?.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-lg bg-muted/30"
                        >
                          <img
                            src={
                              item?.images && item.images.length > 0
                                ? item.images[0].url
                                : "/placeholder.svg?height=120&width=120"
                            }
                            alt={item.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md object-cover bg-muted flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
                            <p className="font-medium text-xs sm:text-sm md:text-base line-clamp-2">
                              {item.name}
                            </p>
                            <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
                              <span>Color: {item.color ?? "—"}</span>
                              <span>Size: {item.size ?? "—"}</span>
                              <span>Qty: {item.quantity}</span>
                            </div>
                            <p className="font-medium text-xs sm:text-sm md:text-base">
                              रु {item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 sm:mt-6 border-t pt-4">
                      <h4 className="font-medium text-sm sm:text-base mb-3 sm:mb-4">
                        Order Timeline
                      </h4>
                      <div className="space-y-2.5 sm:space-y-3">
                        {/* Order Placed */}
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mt-1 bg-green-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs sm:text-sm">
                              Order Placed
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Payment Status */}
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mt-1 flex-shrink-0 ${
                              order.status === "paid"
                                ? "bg-green-500"
                                : order.status === "failed"
                                  ? "bg-red-500"
                                  : order.status === "refunded"
                                    ? "bg-yellow-500"
                                    : "bg-gray-300"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs sm:text-sm">
                              {order.status === "paid"
                                ? "Payment Confirmed"
                                : order.status === "failed"
                                  ? "Payment Failed"
                                  : order.status === "refunded"
                                    ? "Payment Refunded"
                                    : "Payment Pending"}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                              {order.status === "paid"
                                ? "Payment received successfully"
                                : order.status === "failed"
                                  ? "Payment was unsuccessful"
                                  : order.status === "refunded"
                                    ? "Amount has been refunded"
                                    : "Awaiting payment confirmation"}
                            </p>
                          </div>
                          <Badge
                            variant={
                              order.status === "paid"
                                ? "default"
                                : order.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="text-[10px] sm:text-xs shrink-0"
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </div>

                        {/* Order Processing */}
                        {order.orderStatus !== "new" && (
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mt-1 flex-shrink-0 ${
                                order.orderStatus === "processing" ||
                                order.orderStatus === "completed"
                                  ? "bg-green-500"
                                  : order.orderStatus === "cancelled"
                                    ? "bg-red-500"
                                    : "bg-gray-300"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs sm:text-sm">
                                {order.orderStatus === "cancelled"
                                  ? "Order Cancelled"
                                  : "Order Processing"}
                              </p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">
                                {order.orderStatus === "processing"
                                  ? "Your order is being prepared"
                                  : order.orderStatus === "cancelled"
                                    ? "Order has been cancelled"
                                    : order.orderStatus === "completed"
                                      ? "Order was processed successfully"
                                      : "Order being processed"}
                              </p>
                            </div>
                            {order.orderStatus === "processing" && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] sm:text-xs shrink-0"
                              >
                                Processing
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Delivery/Pickup Status */}
                        {order.deliveryMethod === "delivery" &&
                          order.orderStatus !== "cancelled" && (
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div
                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mt-1 flex-shrink-0 ${
                                  order.orderStatus === "completed"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-xs sm:text-sm">
                                  Completed
                                </p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">
                                  {order.orderStatus === "completed"
                                    ? "Package finalized and delivered"
                                    : "Awaiting delivery"}
                                </p>
                              </div>
                              {order.orderStatus === "completed" && (
                                <Badge
                                  variant="default"
                                  className="text-[10px] sm:text-xs shrink-0"
                                >
                                  Completed
                                </Badge>
                              )}
                            </div>
                          )}

                        {order.deliveryMethod === "pickup" &&
                          order.orderStatus !== "cancelled" && (
                            <div className="flex items-start gap-2 sm:gap-3">
                              <div
                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mt-1 flex-shrink-0 ${
                                  order.orderStatus === "completed"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-xs sm:text-sm">
                                  {order.orderStatus === "completed"
                                    ? "Picked Up"
                                    : "Ready for Pickup"}
                                </p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">
                                  {order.orderStatus === "completed"
                                    ? "Order has been collected"
                                    : order.orderStatus === "processing"
                                      ? "Being prepared for pickup"
                                      : "Available at store"}
                                </p>
                              </div>
                              {order.orderStatus === "completed" && (
                                <Badge
                                  variant="default"
                                  className="text-[10px] sm:text-xs shrink-0"
                                >
                                  Completed
                                </Badge>
                              )}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="flex justify-between items-center mt-4 sm:mt-6 border-t pt-3 sm:pt-4">
                      <span className="font-medium text-sm sm:text-base">
                        Order Total
                      </span>
                      <span className="text-lg sm:text-xl md:text-2xl font-semibold">
                        रु {order.amount}
                      </span>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {orders.length === 0 && (
            <Card className="py-12 sm:py-16 text-center">
              <CardContent>
                <Package className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                  No orders yet
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4">
                  Once you place an order, it will appear here.
                </p>
                <Button className="text-sm sm:text-base">Start Shopping</Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

export default OrderPage;
