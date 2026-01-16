import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  AlertCircle,
  MapPin,
  Globe,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/ui/shadcn/card";
import { Button } from "@/ui/shadcn/button";
import { Separator } from "@/ui/shadcn/separator";
import { Label } from "@/ui/shadcn/label";
import { Textarea } from "@/ui/shadcn/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPaymentIntentMutation,
  getCartOptions,
  getCartQueryKey,
  initiateEsewaPaymentMutation,
  removeFromCartMutation,
  updateCartMutation,
} from "@/api/@tanstack/react-query.gen";
import { getImageUrl } from "@/utils/urlHelpers";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DeliveryMethodSelector } from "./DeliveryMethod";
import { getClientInfo } from "@/utils/getClientInfo";
import { cn } from "@/lib/utils";

type DeliveryMethod = "delivery" | "pickup";

export default function CartPage() {
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("delivery");
  const [shippingAddress, setShippingAddress] = useState("");
  const [userLocation, setUserLocation] = useState<{
    city?: string;
    region?: string;
    country?: string;
    ip?: string;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const navigate = useNavigate();
  const {
    data: cartData,
    isPending,
    error,
  } = useQuery({
    ...getCartOptions(),
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const clientInfo = await getClientInfo();
        setUserLocation(clientInfo.location);
      } catch (error) {
        console.error("Failed to fetch location:", error);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    fetchLocation();
  }, []);

  const queryClient = useQueryClient();

  const { mutate: removeCart } = useMutation({
    ...removeFromCartMutation(),
  });

  const { mutate: updateCart } = useMutation({
    ...updateCartMutation(),
  });

  //mutation for pickup order creation
  const { mutate: createPickupOrder, isPending: isPickupPending } = useMutation(
    {
      ...createPaymentIntentMutation(),
      onSuccess: async (data) => {
        const { orderId } = data?.data || {};
        if (!orderId) {
          toast.error("Order creation failed");
          return;
        }
        toast.success("Order reserved! Pay when you pick up in store.");
        navigate({
          to: "/orders",
        });
      },
    }
  );
  const handlePickupOrder = () => {
    createPickupOrder({
      body: {
        deliveryMethod: "pickup",
      },
    });
  };

  const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!
  );

  //mutation for stripe payment intent creation
  const { mutate: paymentCheckout, isPending: ischeckoutPending } = useMutation(
    {
      ...createPaymentIntentMutation(),
      onSuccess: async (data) => {
        const {
          clientSecret,
          orderId,
          deliveryMethod: dm,
          message,
        } = data?.data || {};
        if (!orderId) {
          toast.error("Order creation failed");
          return;
        }

        sessionStorage.setItem(
          "checkout",
          JSON.stringify({
            orderId,
            clientSecret: clientSecret || null,
            deliveryMethod: dm,
            message,
            shippingAddress:
              deliveryMethod === "delivery" ? shippingAddress : null,
          })
        );
        navigate({ to: "/checkout" });
      },
    }
  );

  const handleCheckout = () => {
    // Validate shipping address if delivery is selected
    if (deliveryMethod === "delivery" && !shippingAddress.trim()) {
      toast.error("Please enter your shipping address");
      return;
    }

    paymentCheckout({
      body: {
        deliveryMethod: deliveryMethod,
        shippingAddress,
      },
    });
  };

  //mutation for esewa initiate payment
  const { mutate: esewaCheckout, isPending: isEsewaPending } = useMutation({
    ...initiateEsewaPaymentMutation(),
  });

  const handleEsewaCheckout = () => {
    // Validate shipping address if delivery is selected
    if (deliveryMethod === "delivery" && !shippingAddress.trim()) {
      toast.error("Please enter your shipping address");
      return;
    }

    esewaCheckout(
      {
        body: {
          deliveryMethod: deliveryMethod,
          shippingAddress,
        },
      },
      {
        onSuccess: async (response) => {
          toast.success(response?.message || "eSewa payment initiated");
          console.log("eSewa Payment Data:", response?.data);
          const responseData = response?.data as {
            params?: { productId?: string };
            formUrl?: string;
          };
          sessionStorage.setItem(
            "checkout",
            JSON.stringify({
              provider: "esewa",
              formUrl: responseData?.formUrl as string,
              orderId: responseData?.params?.productId,
              params: responseData?.params,
            })
          );
          navigate({ to: "/checkout/esewa-checkout" });
        },
      }
    );
  };

  const handleCartDeletion = (itemId: string) => {
    removeCart(
      {
        body: {
          bagId: itemId,
        },
      },
      {
        onSuccess: (response) => {
          queryClient.invalidateQueries({
            queryKey: getCartQueryKey(),
          });
          toast.success(response?.message || "Item removed from cart");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to remove item from cart");
        },
      }
    );
  };

  const handleQuantityUpdate = (itemId: string, itemQuantity: number) => {
    updateCart(
      {
        body: {
          bagId: itemId,
          quantity: itemQuantity,
        },
      },
      {
        onSuccess: (response) => {
          queryClient.invalidateQueries({
            queryKey: getCartQueryKey(),
          });
          toast.success(response?.message || "Cart item updated successfully");
        },
      }
    );
  };

  const cartItems =
    cartData?.data?.cartItems.map((item: any) => ({
      id: item.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images,
      size: item.size,
      color: item.color,
      inStock: true,
    })) || [];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 200 ? 0 : 15.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const getLocationString = () => {
    if (!userLocation) return "your area";

    const parts = [];
    if (userLocation.city) parts.push(userLocation.city);
    if (userLocation.region) parts.push(userLocation.region);
    if (userLocation.country) parts.push(userLocation.country);

    return parts.length > 0 ? parts.join(", ") : "your area";
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle className="h-12 w-12 md:h-16 md:w-16 text-destructive" />
        <h2 className="mt-4 text-xl md:text-2xl font-playfair font-semibold">
          Could not load your cart
        </h2>
        <p className="mt-2 text-sm md:text-base text-muted-foreground">
          There was an error fetching your cart data. Please try again later.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* ✅ Header - Mobile Optimized */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Back Button - Mobile */}
            <Link
              to="/"
              className="flex items-center gap-1.5 md:gap-2 text-primary hover:text-primary/80 transition-colors min-w-0"
            >
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm md:text-base truncate">
                Continue
              </span>
            </Link>

            {/* Title - Responsive */}
            <h1 className="text-base sm:text-lg md:text-2xl font-playfair font-bold text-card-foreground truncate">
              Cart
            </h1>

            {/* Items Count */}
            <div className="flex items-center gap-1.5 md:gap-2 text-muted-foreground min-w-0">
              <ShoppingBag className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">
                {cartItems.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 md:py-8">
        <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
          {/* ✅ Cart Items - Mobile Optimized */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <DeliveryMethodSelector
              selectedMethod={deliveryMethod}
              onMethodChange={setDeliveryMethod}
            />

            {/* ✅ Shipping Address - Mobile Optimized */}
            {deliveryMethod === "delivery" && (
              <Card className="border-2 border-primary/20">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
                        <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm md:text-base text-card-foreground">
                          Shipping Address
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Where should we deliver?
                        </p>
                      </div>
                    </div>

                    {!isLoadingLocation && userLocation && (
                      <div
                        className={cn(
                          "flex items-start gap-2 p-2.5 md:p-3 rounded-lg border",
                          userLocation.country?.toLowerCase() !== "nepal"
                            ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900"
                            : "bg-primary/5 border-primary/20"
                        )}
                      >
                        <Globe
                          className={cn(
                            "h-3.5 w-3.5 md:h-4 md:w-4 mt-0.5 flex-shrink-0",
                            userLocation.country?.toLowerCase() !== "nepal"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-primary"
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          {userLocation.country?.toLowerCase() !== "nepal" ? (
                            <div className="space-y-1">
                              <p className="text-[10px] sm:text-xs font-semibold text-amber-700 dark:text-amber-300">
                                International Payment Notice
                              </p>
                              <p className="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                                We detected you're in{" "}
                                <span className="font-semibold">
                                  {getLocationString()}
                                </span>
                                . International card payments are temporarily
                                unavailable.
                              </p>
                            </div>
                          ) : (
                            <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                              You're in{" "}
                              <span className="font-semibold text-foreground">
                                {getLocationString()}
                              </span>
                              . Confirm your address below.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5 md:space-y-2">
                      <Label
                        htmlFor="shipping-address"
                        className="text-xs md:text-sm font-medium"
                      >
                        Full Address <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="shipping-address"
                        placeholder="Enter your complete delivery address..."
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="min-h-[80px] md:min-h-[100px] resize-none text-xs md:text-sm"
                        required
                      />
                      <p className="text-[10px] md:text-xs text-muted-foreground">
                        Include details for timely delivery.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ✅ Cart Items List - Mobile Optimized */}
            <div className="space-y-3 md:space-y-4">
              {isPending ? (
                <Card className="p-8 md:p-12 text-center">
                  <p className="text-sm md:text-base">Loading your cart...</p>
                </Card>
              ) : cartItems.length === 0 ? (
                <Card className="p-8 md:p-12 text-center">
                  <div className="flex flex-col items-center gap-3 md:gap-4">
                    <ShoppingBag className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
                    <h2 className="text-lg md:text-xl font-playfair font-semibold text-muted-foreground">
                      Your cart is empty
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Add some bags to get started
                    </p>
                    <Button asChild className="mt-2 md:mt-4">
                      <Link to="/">Start Shopping</Link>
                    </Button>
                  </div>
                </Card>
              ) : (
                cartItems.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <div className="flex gap-3 sm:gap-4 md:gap-6">
                        {/* ✅ Product Image - Mobile Optimized */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              item.image.length > 0 && item.image[0]?.image
                                ? getImageUrl(item.image[0].image)
                                : "/placeholder.svg?height=120&width=120"
                            }
                            alt={item.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-cover rounded-lg bg-muted"
                          />
                        </div>

                        {/* ✅ Product Details - Mobile Optimized */}
                        <div className="flex-1 flex flex-col justify-between gap-2 md:gap-4 min-w-0">
                          {/* Top Row: Name + Delete */}
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1 min-w-0 flex-1">
                              <h3 className="font-playfair font-semibold text-sm sm:text-base md:text-lg text-card-foreground line-clamp-2">
                                {item.name}
                              </h3>

                              {/* Product Options - Mobile Optimized */}
                              <div className="space-y-0.5 md:space-y-1 mt-1 md:mt-2">
                                {/* Size */}
                                {item.size && (
                                  <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-1.5 md:gap-2">
                                    <span className="font-medium text-card-foreground">
                                      Size:
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] md:text-xs">
                                      {item.size}
                                    </span>
                                  </div>
                                )}

                                {/* Color */}
                                {item.color && (
                                  <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-1.5 md:gap-2">
                                    <span className="font-medium text-card-foreground">
                                      Color:
                                    </span>
                                    <span className="text-[10px] md:text-xs px-1.5 py-0.5 bg-muted rounded">
                                      {item.color.name || "Not specified"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCartDeletion(item.id)}
                              className="text-muted-foreground hover:text-destructive h-7 w-7 md:h-8 md:w-8 p-0"
                            >
                              <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            </Button>
                          </div>

                          {/* Bottom Row: Price + Quantity - Mobile Optimized */}
                          <div className="flex justify-between items-center gap-2">
                            <div className="flex items-center gap-1 md:gap-2">
                              <span className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground">
                                रु {item.price.toFixed(2)}
                              </span>
                            </div>

                            {/* ✅ Quantity Controls - Mobile Optimized */}
                            <div className="flex items-center gap-2 md:gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="h-7 w-7 md:h-8 md:w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>

                              <span className="font-medium min-w-[1.5rem] md:min-w-[2rem] text-center text-sm md:text-base">
                                {item.quantity}
                              </span>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="h-7 w-7 md:h-8 md:w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* ✅ Order Summary - Sticky on Mobile Bottom */}
          <div className="lg:col-span-1">
            {/* Desktop: Sticky Sidebar */}
            <Card className="hidden lg:block sticky top-24">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-playfair font-semibold text-card-foreground">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({cartItems.length} items)
                    </span>
                    <span className="font-medium">
                      रु {subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {deliveryMethod === "pickup" ? "Pickup" : "Shipping"}
                    </span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        ` रु ${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">रू{tax.toFixed(2)}</span>
                  </div>

                  {deliveryMethod === "delivery" &&
                    subtotal > 0 &&
                    subtotal < 200 && (
                      <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                        Add रु {(200 - subtotal).toFixed(2)} more for free
                        shipping
                      </div>
                    )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">रु {total.toFixed(2)}</span>
                </div>

                {/* Payment Buttons */}
                <div className="space-y-3">
                  {/* eSewa Button - Highlighted */}
                  <Button
                    className={cn(
                      "w-full h-12 text-base font-semibold",
                      deliveryMethod === "pickup"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
                      "text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    )}
                    onClick={
                      deliveryMethod === "pickup"
                        ? handlePickupOrder
                        : handleEsewaCheckout
                    }
                    disabled={
                      cartItems.length === 0 ||
                      cartItems.some((item) => !item.inStock) ||
                      ischeckoutPending ||
                      isPickupPending ||
                      (deliveryMethod === "delivery" && !shippingAddress.trim())
                    }
                  >
                    {ischeckoutPending || isPickupPending
                      ? "Processing..."
                      : deliveryMethod === "pickup"
                      ? "Reserve & Pay in Store"
                      : "Pay with eSewa"}
                  </Button>
                  {deliveryMethod === "delivery" && (
                    <>
                      {/* Divider with "OR" */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <Separator />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">
                            or
                          </span>
                        </div>
                      </div>

                      {/* Card Payment Button */}
                      <Button
                        variant="outline"
                        className="w-full h-12 text-sm font-medium border-2 opacity-60 cursor-not-allowed"
                        disabled
                      >
                        International Card Payment (Coming Soon)
                      </Button>
                    </>
                  )}

                  {/* International Payment Notice */}
                  {deliveryMethod === "delivery" && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                      <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                        International card payments are temporarily unavailable.
                        We are currently integrating a secure multi-currency
                        payment system to better support our global customers.
                        Please check back soon.
                      </p>
                    </div>
                  )}
                </div>

                {deliveryMethod === "pickup" ? (
                  <p className="text-xs text-muted-foreground text-center">
                    No online payment required. Reserve your items and pay when
                    you pick up in store.
                  </p>
                ) : (
                  !shippingAddress.trim() && (
                    <p className="text-xs text-destructive text-center">
                      Please enter your shipping address to continue
                    </p>
                  )
                )}
              </CardContent>
            </Card>

            {/* ✅ Mobile: Fixed Bottom Summary */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg">
              <div className="container mx-auto px-3 sm:px-4 py-3">
                <div className="space-y-2.5">
                  {/* Summary Details */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Subtotal ({cartItems.length})
                      </span>
                      <span className="font-medium">
                        रु{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {deliveryMethod === "pickup" ? "Pickup" : "Shipping"}
                      </span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `रु ${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <Separator className="my-1.5" />
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total</span>
                      <span className="text-primary">
                        रू {total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <Button
                    className={cn(
                      "w-full h-11 text-sm font-semibold",
                      deliveryMethod === "pickup"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700"
                        : "bg-gradient-to-r from-green-600 to-green-700",
                      "text-white shadow-lg"
                    )}
                    onClick={
                      deliveryMethod === "pickup"
                        ? handlePickupOrder
                        : handleEsewaCheckout
                    }
                    disabled={
                      cartItems.length === 0 ||
                      cartItems.some((item) => !item.inStock) ||
                      ischeckoutPending ||
                      isPickupPending ||
                      (deliveryMethod === "delivery" && !shippingAddress.trim())
                    }
                  >
                    {ischeckoutPending || isPickupPending
                      ? "Processing..."
                      : deliveryMethod === "pickup"
                      ? "Reserve & Pay in Store"
                      : "Pay with eSewa"}
                  </Button>

                  {!shippingAddress.trim() && deliveryMethod === "delivery" && (
                    <p className="text-[10px] text-destructive text-center">
                      Enter shipping address above
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
