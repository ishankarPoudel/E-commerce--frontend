import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "@/ui/shadcn/drawer";
import { Button } from "@/ui/shadcn/button";
import { Badge } from "@/ui/shadcn/badge";
import { Separator } from "@/ui/shadcn/separator";
import { ScrollArea } from "@/ui/shadcn/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/shadcn/avatar";
import { OrderEntity } from "@/api";
import {
  Copy,
  CreditCard,
  Package,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  Mail,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface OrderDetailsDrawerProps {
  order: OrderEntity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetails({
  order,
  open,
  onOpenChange,
}: OrderDetailsDrawerProps) {
  const [loadingUserOrders, setLoadingUserOrders] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "completed":
        return {
          badge:
            "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />,
        };
      case "processing":
        return {
          badge: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",
          icon: <Clock className="w-3.5 h-3.5 mr-1.5" />,
        };
      case "cancelled":
        return {
          badge: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",
          icon: <XCircle className="w-3.5 h-3.5 mr-1.5" />,
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100",
          icon: <Package className="w-3.5 h-3.5 mr-1.5" />,
        };
    }
  };

  const statusStyle = getStatusStyles(order.orderStatus);

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        size="xl"
        className="overflow-x-visible rounded-l-2xl bg-white shadow-2xl"
      >
        <div className="flex flex-col h-full">
          {/* --- HEADER --- */}
          <DrawerHeader className="border-b px-6 py-5 bg-gray-50/40">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <DrawerTitle className="text-xl font-bold flex items-center gap-2">
                  Order #{order.id?.slice(0, 8)}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => copyToClipboard(order.id, "Order ID")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </DrawerTitle>
                <DrawerDescription className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3" />
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "N/A"}
                </DrawerDescription>
              </div>
              <Badge
                variant="outline"
                className={`px-3 py-1 text-sm font-medium capitalize transition-colors ${statusStyle.badge}`}
              >
                {statusStyle.icon}
                {order.orderStatus}
              </Badge>
            </div>
          </DrawerHeader>

          {/* --- SCROLLABLE CONTENT --- */}
          <ScrollArea className="flex-1">
            <div className="px-6 py-6 space-y-8">
              {/* 1. Customer Section */}
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" /> Customer Details
                </h3>
                <div className="bg-card rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src="" /> {/* Add user image if available */}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {order.user?.fullName?.slice(0, 2).toUpperCase() ||
                          "GU"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className=" break-words font-semibold text-base text-foreground">
                        {order.user?.fullName || "Guest User"}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground group cursor-pointer hover:text-primary transition-colors">
                        <Mail className="h-3.5 w-3.5" />
                        {order.user?.email}
                        <Copy
                          className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            copyToClipboard(order.user?.email, "Email")
                          }
                        />
                      </div>
                      {/* If you have phone number */}
                      {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Smartphone className="h-3.5 w-3.5" />
                        +1 (555) 000-0000
                      </div> */}
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Delivery & Payment Grid */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                {/* Delivery */}
                <div className="rounded-xl border p-4 bg-gray-50/30">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5" /> Delivery Method
                  </h4>
                  <div className="space-y-1">
                    <p className="font-medium capitalize flex items-center gap-2">
                      {order.deliveryMethod === "delivery" ? (
                        <Truck className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Package className="h-4 w-4 text-orange-500" />
                      )}
                      {order.deliveryMethod}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Standard Shipping
                    </p>
                  </div>
                </div>

                {/* Payment */}
                <div className="rounded-xl border p-4 bg-gray-50/30">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5" /> Payment
                  </h4>
                  <div className="space-y-1">
                    <p className="font-medium flex items-center gap-2">
                      <span className="bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded">
                        STRIPE
                      </span>
                      •••• 4242
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Paid on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. Order Items */}
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" /> Order Items
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {order.items?.length || 0} Items
                  </Badge>
                </h3>
                <div className="rounded-xl border overflow-hidden">
                  <div className="divide-y">
                    {order.items?.map((item: any, index) => (
                      <div
                        key={item.id || index}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="h-16 w-16 rounded-lg border bg-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            src={
                              item.product?.images?.[0]?.url ||
                              item.product?.images?.[0] ||
                              "/placeholder.png"
                            }
                            alt={item.product?.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.product?.name || "Unknown Product"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Qty: {item.quantity} × $
                            {item.unitPrice || item.price}
                          </p>
                        </div>
                        <div className="text-right font-medium text-sm">
                          $
                          {(
                            (item.quantity || 0) *
                            (item.unitPrice || item.price || 0)
                          ).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Footer inside Items Card */}
                  <div className="bg-gray-50/50 p-4 space-y-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${order.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>$0.00</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-base">Total</span>
                      <span className="font-bold text-xl text-primary">
                        ${order.amount}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </ScrollArea>

          {/* --- FOOTER ACTIONS --- */}
          <DrawerFooter className="border-t px-6 py-4 bg-gray-50/40">
            <div className="flex gap-3 w-full">
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1">
                  Close
                </Button>
              </DrawerClose>
              <Button className="flex-1 gap-2">
                <Mail className="h-4 w-4" />
                Send Invoice
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
