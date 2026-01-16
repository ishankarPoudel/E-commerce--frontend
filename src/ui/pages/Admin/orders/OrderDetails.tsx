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
  MapPin,
  Palette,
  Ruler,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getOrderDetailsByOrderIdForAdminOptions } from "@/api/@tanstack/react-query.gen";
import { getImageUrl } from "@/utils/urlHelpers";

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
  const { data: orderDetails, isLoading: loadingOrderDetails } = useQuery({
    ...getOrderDetailsByOrderIdForAdminOptions({
      query: { orderId: order.id as string },
    }),
  });

  const data = orderDetails?.data;
  console.log("order details data", data);

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

  const getPaymentProviderInfo = () => {
    if (data?.paymentProvider === "esewa") {
      return {
        name: "eSewa",
        logo: "https://esewa.com.np/common/images/esewa_logo.png",
        color: "bg-green-600",
        displayText: "eSewa Wallet",
      };
    } else if (data?.paymentProvider === "stripe") {
      return {
        name: "Stripe",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
        color: "bg-slate-800",
        displayText: "Card Payment",
      };
    }
    return {
      name: "Unknown",
      logo: null,
      color: "bg-gray-600",
      displayText: "Payment",
    };
  };

  const paymentInfo = getPaymentProviderInfo();

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        size="xl"
        className="overflow-x-visible rounded-l-2xl bg-white shadow-2xl"
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <DrawerHeader className="border-b px-6 py-5 bg-gray-50/40">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <DrawerTitle className="text-xl font-bold flex items-center gap-2">
                  Order #{order.id.slice(-8).toUpperCase()}
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

          {/* CONTENT */}
          <ScrollArea className="flex-1 h-vh overflow-y-auto">
            <div className="px-6 py-6 space-y-8">
              {/* CUSTOMER DETAILS */}
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" /> Customer Details
                </h3>

                <div className="bg-card rounded-xl border p-4 shadow-sm">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {data?.user?.fullName?.slice(0, 2).toUpperCase() ||
                          "GU"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-1">
                      <p className="font-semibold text-base text-foreground">
                        {data?.user?.fullName || "Guest User"}
                      </p>

                      <div
                        className="flex items-center gap-2 text-sm text-muted-foreground group cursor-pointer hover:text-primary"
                        onClick={() =>
                          data?.user?.email &&
                          copyToClipboard(data.user.email, "Email")
                        }
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {data?.user?.email}
                        <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* DELIVERY & PAYMENT */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* DELIVERY */}
                <div className="rounded-xl border p-4 bg-gray-50/30">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5" /> Delivery Method
                  </h4>
                  <div className="space-y-2">
                    <p className="font-medium flex items-center gap-2 capitalize">
                      {data?.deliveryMethod === "delivery" ? (
                        <Truck className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Package className="h-4 w-4 text-orange-500" />
                      )}
                      {data?.deliveryMethod}
                    </p>

                    {data?.deliveryMethod === "delivery" && (
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-blue-500" />
                          <div>
                            <p className="font-medium text-foreground mb-0.5">
                              Shipping Address:
                            </p>
                            <p className="leading-relaxed">
                              {data?.shippingAddress || "Not provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {data?.deliveryMethod === "pickup" && (
                      <p className="text-xs text-muted-foreground">
                        Customer will pick up from store
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-xl border p-4 bg-gray-50/30">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5" /> Payment
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`${paymentInfo.color} text-white text-[10px] px-2 py-1 rounded font-medium`}
                      >
                        {paymentInfo.name.toUpperCase()}
                      </span>
                      <span className="font-medium text-sm">
                        {paymentInfo.displayText}
                      </span>
                    </div>

                    {/* eSewa Details */}
                    {data?.paymentProvider === "esewa" && (
                      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                        {data?.esewaRefId && <p>Ref ID: {data.esewaRefId}</p>}
                        {data?.esewaStatus && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] mt-1"
                          >
                            Status: {data.esewaStatus}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Stripe Details */}
                    {data?.paymentProvider === "stripe" && (
                      <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                        {data?.stripeChargeId && (
                          <p className="truncate">
                            Charge: {data.stripeChargeId.slice(0, 20)}...
                          </p>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      {data?.status === "paid"
                        ? `Paid on ${new Date(
                            order.createdAt
                          ).toLocaleDateString()}`
                        : `Status: ${data?.status}`}
                    </p>
                  </div>
                </div>
              </section>

              {/* ORDER ITEMS */}
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" /> Order Items
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {Array.isArray(data?.itemsSnapShot)
                      ? data.itemsSnapShot.length
                      : 0}{" "}
                    Items
                  </Badge>
                </h3>

                <div className="rounded-xl border overflow-hidden">
                  <div className="divide-y">
                    {Array.isArray(data?.itemsSnapShot) &&
                      data.itemsSnapShot.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="h-20 w-20 rounded-lg border bg-gray-100 overflow-hidden flex-shrink-0">
                            <img
                              src={getImageUrl(
                                item.image || "/placeholder.png"
                              )}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1.5">
                            <p className="font-medium text-sm">{item.name}</p>

                            <div className="flex flex-wrap gap-2">
                              {item.size && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  <Ruler className="h-3 w-3 mr-1" />
                                  Size: {item.size}
                                </Badge>
                              )}
                              {item.color && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                                >
                                  <Palette className="h-3 w-3 mr-1" />
                                  Color: {item.color}
                                </Badge>
                              )}
                            </div>

                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>

                          <div className="text-right font-semibold text-sm">
                            {(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* SUMMARY */}
                  <div className="bg-gray-50/50 p-4 space-y-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>रु {data?.amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>रु 0.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>रु 0.00</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-base">Total</span>
                      <span className="font-bold text-xl text-primary">
                        रु {data?.amount}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </ScrollArea>

          {/* FOOTER */}
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
