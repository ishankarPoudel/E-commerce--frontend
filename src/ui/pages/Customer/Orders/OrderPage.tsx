import { cn } from "@/lib/utils";
import { Badge } from "@/ui/shadcn/badge";
import { Button } from "@/ui/shadcn/button";
import { Card, CardContent, CardHeader } from "@/ui/shadcn/card";
import { Separator } from "@radix-ui/react-separator";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Package,
} from "lucide-react";
import { useState } from "react";

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "paid" as const,
    total: 1299.99,
    items: [
      {
        id: "1",
        name: "Premium Leather Tote Bag",
        image: "/luxury-leather-tote-bag.jpg",
        price: 899.99,
        quantity: 1,
        color: "Cognac Brown",
        size: "Large",
      },
      {
        id: "2",
        name: "Silk Scarf Accessory",
        image: "/luxury-silk-scarf.png",
        price: 400.0,
        quantity: 1,
        color: "Navy Blue",
        size: "One Size",
      },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-10",
    status: "processing" as const,
    total: 2199.99,
    items: [
      {
        id: "3",
        name: "Designer Crossbody Bag",
        image: "/designer-crossbody-bag.jpg",
        price: 1599.99,
        quantity: 1,
        color: "Black",
        size: "Medium",
      },
      {
        id: "4",
        name: "Leather Wallet",
        image: "/luxury-leather-wallet.png",
        price: 600.0,
        quantity: 1,
        color: "Black",
        size: "Standard",
      },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-05",
    status: "cancelled" as const,
    total: 799.99,
    items: [
      {
        id: "5",
        name: "Evening Clutch Bag",
        image: "/luxury-evening-clutch.jpg",
        price: 799.99,
        quantity: 1,
        color: "Gold",
        size: "Small",
      },
    ],
  },
  {
    id: "ORD-2024-004",
    date: "2023-12-28",
    status: "not confirmed" as const,
    total: 1599.99,
    items: [
      {
        id: "6",
        name: "Vintage Leather Satchel",
        image: "/vintage-leather-satchel.jpg",
        price: 1599.99,
        quantity: 1,
        color: "Tan",
        size: "Large",
      },
    ],
  },
];

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
const OrderPage = () => {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrder = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NPR",
    }).format(price);
  };
  return (
    <div className='min-h-screen w-[1024px] bg-background'>
      <main className='px-4 py-8 mx-auto'>
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div className='heading'>
              <h1 className='text-2xl font-bold bg-transparent'>My Orders</h1>
              <p className='text-sm text-muted-foreground'>
                Manage your orders and track their status
              </p>
            </div>
            <div className='text-sm text-muted-foreground'>
              {mockOrders.length} {mockOrders.length === 1 ? "order" : "orders"}
            </div>
          </div>

          <div className='space-y-4 '>
            {mockOrders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              const StatusIcon = statusConfig[order.status].icon;

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
                            {formatDate(order.date)}
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center gap-4'>
                        <Badge
                          variant='outline'
                          className={cn(
                            "font-medium",
                            statusConfig[order.status].className
                          )}>
                          <StatusIcon className='h-3 w-3 mr-1' />
                          {statusConfig[order.status].label}
                        </Badge>
                        <div className='text-right'>
                          <div className='font-semibold text-foreground'>
                            {formatPrice(order.total)}
                          </div>
                          <div className='text-sm text-muted-foreground'>
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "item" : "items"}
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
                        {order.items.map((item, index) => (
                          <div
                            key={item.id || index}
                            className='flex items-center gap-4 p-4 bg-muted/30 rounded-lg'>
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className='w-16 h-16 object-cover rounded-md bg-muted'
                            />
                            <div className='flex-1'>
                              <h5 className='font-medium text-foreground'>
                                {item.name}
                              </h5>
                              <div className='flex items-center gap-4 mt-1 text-sm text-muted-foreground'>
                                <span>Color: {item.color}</span>
                                <span>Size: {item.size}</span>
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <div className='text-right'>
                              <div className='font-medium text-foreground'>
                                {formatPrice(item.price)}
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className='flex justify-between items-center pt-4 border-t border-border'>
                          <span className='font-medium text-foreground'>
                            Order Total
                          </span>
                          <span className='text-xl font-semibold text-foreground'>
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {mockOrders.length === 0 && (
            <Card className='text-center py-12'>
              <CardContent>
                <Package className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                <h3 className='text-lg font-medium text-foreground mb-2'>
                  No orders yet
                </h3>
                <p className='text-muted-foreground mb-4'>
                  {
                    "You haven't placed any orders yet. Start shopping to see your orders here."
                  }
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
