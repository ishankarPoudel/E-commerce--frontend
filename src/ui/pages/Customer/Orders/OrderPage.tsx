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

import { getImageUrl } from "@/utils/urlHelpers";
import { Separator } from "@radix-ui/react-separator";

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
      month: "long",
      day: "numeric",
    });

  const formatPrice = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(v);

  const filtered = orders
    .filter((o) =>
      deliveryFilter === "all" ? true : o.deliveryMethod === deliveryFilter
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
      <div className="p-10 text-sm text-muted-foreground">Loading orders…</div>
    );
  if (error)
    return (
      <div className="p-10 text-sm text-destructive">Failed to load orders</div>
    );

  return (
    <div className="w-full flex-1 bg-background min-h-screen">
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review your past purchases and track the status of your orders.
          </p>
        </section>

        {/* ---------- STATS SUMMARY ---------- */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Card>
            <CardContent className="">
              <p className="text-xs text-muted-foreground">Total Orders</p>
              <p className="text-xl font-semibold">{orders.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-semibold">
                {orders.filter((x) => x.status === "pending").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="">
              <p className="text-xs text-muted-foreground">Paid</p>
              <p className="text-xl font-semibold">
                {orders.filter((x) => x.status === "paid").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="">
              <p className="text-xs text-muted-foreground">Total Spent</p>
              <p className="text-xl font-semibold">
                {formatPrice(
                  orders.reduce((sum, x) => sum + (x.amount || 0), 0)
                )}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ---------- FILTER BAR ---------- */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Delivery Filter */}
          <Tabs
            value={deliveryFilter}
            onValueChange={setDeliveryFilter}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Package className="h-4 w-4" /> All
              </TabsTrigger>

              <TabsTrigger value="delivery" className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> Delivery
              </TabsTrigger>

              <TabsTrigger value="pickup" className="flex items-center gap-2">
                <Store className="h-4 w-4" /> Pickup
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
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

        <div className="text-sm text-muted-foreground">
          Showing {filtered.length} of {orders.length} orders
        </div>

        {/* ---------- ORDERS LIST ---------- */}
        <section className="space-y-5">
          {filtered.map((order: any) => {
            const isOpen = expanded === order.id;

            return (
              <Card
                key={order.id}
                className="border rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  {/* Left */}
                  <div>
                    <h3 className="font-semibold">{formatOrderId(order.id)}</h3>

                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.createdAt)}
                    </div>

                    <Badge
                      variant="secondary"
                      className="mt-2 flex items-center gap-2"
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

                  {/* Right */}
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.amount)}</p>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1"
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                    >
                      {isOpen ? (
                        <>
                          Hide Details <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          View Details <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>

                {/* EXPANDED CONTENT */}

                {isOpen && (
                  <CardContent className="pb-6">
                    <Separator className="my-4" />

                    <h4 className="font-medium mb-4">Order Items</h4>

                    <div className="space-y-4">
                      {order.itemsSnapShot?.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
                        >
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-16 h-16 rounded-md object-cover bg-muted"
                          />

                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                              <span>Color: {item.color ?? "—"}</span>
                              <span>Size: {item.size ?? "—"}</span>
                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>

                          <p className="font-medium">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Status Timeline */}
                    <div className="mt-6 border-t pt-4">
                      <h4 className="font-medium mb-4">Order Timeline</h4>
                      <div className="space-y-3">
                        {/* Order Placed - Always shown */}
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 rounded-full mt-1 bg-green-500" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">Order Placed</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Payment Status */}
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-3 h-3 rounded-full mt-1 ${
                              order.status === "paid"
                                ? "bg-green-500"
                                : order.status === "failed"
                                ? "bg-red-500"
                                : order.status === "refunded"
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {order.status === "paid"
                                ? "Payment Confirmed"
                                : order.status === "failed"
                                ? "Payment Failed"
                                : order.status === "refunded"
                                ? "Payment Refunded"
                                : "Payment Pending"}
                            </p>
                            <p className="text-xs text-muted-foreground">
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
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </div>

                        {/* Order Processing - Show if not new */}
                        {order.orderStatus !== "new" && (
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-3 h-3 rounded-full mt-1 ${
                                order.orderStatus === "processing" ||
                                order.orderStatus === "completed"
                                  ? "bg-green-500"
                                  : order.orderStatus === "cancelled"
                                  ? "bg-red-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {order.orderStatus === "cancelled"
                                  ? "Order Cancelled"
                                  : "Order Processing"}
                              </p>
                              <p className="text-xs text-muted-foreground">
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
                              <Badge variant="secondary">Processing</Badge>
                            )}
                          </div>
                        )}

                        {/* Delivery Method Specific Steps */}
                        {order.deliveryMethod === "delivery" &&
                          order.orderStatus !== "cancelled" && (
                            <>
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-3 h-3 rounded-full mt-1 ${
                                    order.orderStatus === "completed"
                                      ? "bg-green-500"
                                      : "bg-gray-300"
                                  }`}
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    Completed
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {order.orderStatus === "completed"
                                      ? "Package finalized and delivered"
                                      : "Awaiting delivery"}
                                  </p>
                                </div>
                                {order.orderStatus === "completed" && (
                                  <Badge variant="default">Completed</Badge>
                                )}
                              </div>
                            </>
                          )}

                        {order.deliveryMethod === "pickup" &&
                          order.orderStatus !== "cancelled" && (
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-3 h-3 rounded-full mt-1 ${
                                  order.orderStatus === "completed"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {order.orderStatus === "completed"
                                    ? "Picked Up"
                                    : "Ready for Pickup"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {order.orderStatus === "completed"
                                    ? "Order has been collected"
                                    : order.orderStatus === "processing"
                                    ? "Being prepared for pickup"
                                    : "Available at store"}
                                </p>
                              </div>
                              {order.orderStatus === "completed" && (
                                <Badge variant="default">Completed</Badge>
                              )}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-6 border-t pt-4">
                      <span className="font-medium">Order Total</span>
                      <span className="text-xl font-semibold">
                        {formatPrice(order.amount)}
                      </span>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {/* Empty State */}
          {orders.length === 0 && (
            <Card className="py-16 text-center">
              <CardContent>
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  Once you place an order, it will appear here.
                </p>
                <Button>Start Shopping</Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

export default OrderPage;
