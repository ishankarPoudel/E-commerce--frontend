import { getAllOrdersOptions } from "@/api/@tanstack/react-query.gen";
import { cn } from "@/lib/utils";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Card, CardContent, CardHeader } from "@/ui/shadcn/card";
import { getImageUrl } from "@/utils/urlHelpers";
import { Separator } from "@radix-ui/react-separator";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Package,
} from "lucide-react";
import { useState } from "react";

const statusConfig = {
  paid: {
    label: "Paid",
    className:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
    icon: CreditCard,
  },
  processing: {
    label: "Processing",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    icon: Package,
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    icon: Package,
  },
  "not confirmed": {
    label: "Not Confirmed",
    className:
      "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800",
    icon: Package,
  },
};
// ...existing imports...

const OrderPage = () => {
  const {
    data: ordersResponse,
    isPending,
    error,
  } = useQuery({
    ...getAllOrdersOptions(),
  });

  console.log("ordersResponse:", ordersResponse);

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

  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      next.has(orderId) ? next.delete(orderId) : next.add(orderId);
      return next;
    });
  };

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
      <div className='p-8 text-sm text-muted-foreground'>Loading orders...</div>
    );
  }
  if (error) {
    return (
      <div className='p-8 text-sm text-destructive'>Failed to load orders</div>
    );
  }

  return (
    <div className='w-full flex-1 bg-background min-h-screen'>
      <main className='w-[1024px] px-4 md:px-8 py-8'>
        <div className='mx-auto w-full max-w-screen-2xl space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>My Orders</h1>
              <p className='text-sm text-muted-foreground'>
                Manage your orders and track their status
              </p>
            </div>
            <div className='text-sm text-muted-foreground'>
              {ordersArray.length}{" "}
              {ordersArray.length === 1 ? "order" : "orders"}
            </div>
          </div>

          <div className='space-y-4'>
            {ordersArray.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              const statusInfo =
                statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = statusInfo ? statusInfo.icon : Package;

              return (
                <Card
                  key={order.id}
                  className='overflow-hidden transition-all duration-200 hover:shadow-md'>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div>
                          <h3 className='font-medium text-foreground'>
                            {order.id}
                          </h3>
                          <div className='flex items-center gap-2 mt-1 text-sm text-muted-foreground'>
                            <Calendar className='h-4 w-4' />
                            {order.createdAt
                              ? formatDate(order.createdAt)
                              : "—"}
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-4'>
                        <Badge
                          variant='outline'
                          className={cn(
                            "font-medium",
                            statusInfo?.className ??
                              "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800"
                          )}>
                          <StatusIcon className='h-3 w-3 mr-1' />
                          {statusInfo?.label ?? "Unknown"}
                        </Badge>
                        <div className='text-right'>
                          <div className='font-semibold text-foreground'>
                            {formatPrice(order.amount || 0)}
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            {Array.isArray(order.itemsSnapShot)
                              ? order.itemsSnapShot.length
                              : 0}{" "}
                            {Array.isArray(order.itemsSnapShot) &&
                            order.itemsSnapShot.length === 1
                              ? "item"
                              : "items"}
                          </div>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => toggleOrder(order.id)}
                          className='ml-2'>
                          {isExpanded ? (
                            <ChevronUp className='h-4 w-4' />
                          ) : (
                            <ChevronDown className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className='pt-0'>
                      <Separator className='mb-4' />
                      <div className='space-y-4'>
                        <h4 className='font-medium text-foreground'>
                          Order Items
                        </h4>
                        {Array.isArray(order.itemsSnapShot) &&
                          order.itemsSnapShot.map((item: any, idx: number) => (
                            <div
                              key={item.id || idx}
                              className='flex items-center gap-4 p-4 bg-muted/30 rounded-lg'>
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name}
                                className='w-16 h-16 object-cover rounded-md bg-muted'
                              />
                              <div className='flex-1'>
                                <h5 className='font-medium text-foreground'>
                                  {item.name}
                                </h5>
                                <div className='flex items-center gap-4 mt-1 text-sm text-muted-foreground'>
                                  <span>Color: {item.color || "—"}</span>
                                  <span>Size: {item.size || "—"}</span>
                                  <span>Qty: {item.quantity ?? 1}</span>
                                </div>
                              </div>
                              <div className='text-right'>
                                <div className='font-medium text-foreground'>
                                  {formatPrice(item.price || 0)}
                                </div>
                              </div>
                            </div>
                          ))}

                        <div className='flex justify-between items-center pt-4 border-t border-border'>
                          <span className='font-medium text-foreground'>
                            Order Total
                          </span>
                          <span className='text-xl font-semibold text-foreground'>
                            {formatPrice(order.amount || 0)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {ordersArray.length === 0 && (
            <Card className='text-center py-12'>
              <CardContent>
                <Package className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                <h3 className='text-lg font-medium text-foreground mb-2'>
                  No orders yet
                </h3>
                <p className='text-muted-foreground mb-4'>
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
