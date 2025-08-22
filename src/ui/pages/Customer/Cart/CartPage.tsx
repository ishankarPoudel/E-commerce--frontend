import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/ui/shadcn/card";
import { Button } from "@/ui/shadcn/button";
import { Separator } from "@/ui/shadcn/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPaymentIntentMutation,
  getCartOptions,
  getCartQueryKey,
  removeFromCartMutation,
  updateCartMutation,
} from "@/api/@tanstack/react-query.gen";
import { getImageUrl } from "@/utils/urlHelpers";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";

export default function CartPage() {
  const {
    data: cartData,
    isPending,
    error,
  } = useQuery({
    ...getCartOptions(),
  });

  const queryClient = useQueryClient();
  // mutation to delete the entire cart
  const { mutate: removeCart } = useMutation({
    ...removeFromCartMutation(),
  });

  //mutation to update cart item quantity
  const { mutate: updateCart } = useMutation({
    ...updateCartMutation(),
  });

  const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!
  );
  //mutataion to handle checkout
  const { mutate: paymentCheckout, isPending: ischeckoutPending } = useMutation(
    {
      ...createPaymentIntentMutation(),
      onSuccess: async (data) => {
        const stripe = await stripePromise;
        if (!stripe) {
          toast.error("Stripe not initialized");
          return;
        }
        const result = await stripe.confirmPayment({
          clientSecret: data.data.clientSecret,
          redirect: "if_required",
        });
        if (result.error) {
          toast.error(result.error.message);
        } else {
          toast.success("Payment successful!");
        }
      },
    }
  );
  const handleCheckout = () => {
    //@ts-expect-error
    paymentCheckout({ body: {} });
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
    cartData?.data?.cartItems?.map((item) => ({
      id: item.id,
      bagId: item.bag.id,
      name: item.bag.name,
      price: item.bag.price,
      quantity: item.quantity,
      image: item.bag.bagImages || [], // Assuming 'image' is a property on the bag
      inStock: true, // Assuming all items are in stock for now
    })) || [];
  console.log(cartItems);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 200 ? 0 : 15.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Render error state
  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
        <AlertCircle className='h-16 w-16 text-destructive' />
        <h2 className='mt-4 text-2xl font-playfair font-semibold'>
          Could not load your cart
        </h2>
        <p className='mt-2 text-muted-foreground'>
          There was an error fetching your cart data. Please try again later.
        </p>
        <Button asChild className='mt-6'>
          <Link to='/'>Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <Link
              to='/'
              className='flex items-center gap-2 text-primary hover:text-primary/80 transition-colors'>
              <ArrowLeft className='h-5 w-5' />
              <span className='font-medium'>Continue Shopping</span>
            </Link>
            <h1 className='text-2xl font-playfair font-bold text-card-foreground'>
              Shopping Cart
            </h1>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <ShoppingBag className='h-5 w-5' />
              <span className='font-medium'>{cartItems.length} items</span>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2 space-y-4'>
            {isPending ? (
              <Card className='p-12 text-center'>
                <p>Loading your cart...</p>
              </Card>
            ) : cartItems.length === 0 ? (
              <Card className='p-12 text-center'>
                <div className='flex flex-col items-center gap-4'>
                  <ShoppingBag className='h-16 w-16 text-muted-foreground' />
                  <h2 className='text-xl font-playfair font-semibold text-muted-foreground'>
                    Your cart is empty
                  </h2>
                  <p className='text-muted-foreground'>
                    Add some beautiful bags to get started
                  </p>
                  <Button asChild className='mt-4'>
                    <Link to='/'>Start Shopping</Link>
                  </Button>
                </div>
              </Card>
            ) : (
              cartItems.map((item) => (
                <Card
                  key={item.id}
                  className='overflow-hidden hover:shadow-md transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='flex gap-6'>
                      {/* Product Image */}
                      <div className='relative flex-shrink-0'>
                        <img
                          src={
                            item.image.length > 0 && item.image[0]?.image
                              ? getImageUrl(item.image[0].image)
                              : "/placeholder.svg?height=120&width=120"
                          }
                          alt={item.name}
                          className='w-32 h-32 object-cover rounded-lg bg-muted'
                        />
                      </div>

                      {/* Product Details */}
                      <div className='flex-1 space-y-3'>
                        <div className='flex justify-between items-start'>
                          <div>
                            <h3 className='font-playfair font-semibold text-lg text-card-foreground'>
                              {item.name}
                            </h3>
                            <p className='text-sm text-muted-foreground mt-1'>
                              {item.name}
                            </p>
                          </div>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleCartDeletion(item.id)}
                            className='text-muted-foreground hover:text-destructive'>
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>

                        <div className='flex justify-between items-center'>
                          {/* Price */}
                          <div className='flex items-center gap-2'>
                            <span className='text-xl font-semibold text-card-foreground'>
                              ${item.price.toFixed(2)}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className='flex items-center gap-3'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                handleQuantityUpdate(item.id, item.quantity - 1)
                              }
                              className='h-8 w-8 p-0'>
                              <Minus className='h-3 w-3' />
                            </Button>
                            <span className='font-medium min-w-[2rem] text-center'>
                              {item.quantity}
                            </span>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                handleQuantityUpdate(item.id, item.quantity + 1)
                              }
                              className='h-8 w-8 p-0'>
                              <Plus className='h-3 w-3' />
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

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-24'>
              <CardContent className='p-6 space-y-6'>
                <h2 className='text-xl font-playfair font-semibold text-card-foreground'>
                  Order Summary
                </h2>

                <div className='space-y-3'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Subtotal ({cartItems.length} items)
                    </span>
                    <span className='font-medium'>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Shipping</span>
                    <span className='font-medium'>
                      {shipping === 0 ? (
                        <span className='text-green-600'>Free</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Tax</span>
                    <span className='font-medium'>${tax.toFixed(2)}</span>
                  </div>

                  {subtotal > 0 && subtotal < 200 && (
                    <div className='text-xs text-muted-foreground bg-muted p-3 rounded-lg'>
                      Add ${(200 - subtotal).toFixed(2)} more for free shipping
                    </div>
                  )}
                </div>

                <Separator />

                <div className='flex justify-between text-lg font-semibold'>
                  <span>Total</span>
                  <span className='text-primary'>${total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className='w-full h-12 text-base font-medium'
                  disabled={
                    cartItems.length === 0 ||
                    cartItems.some((item) => !item.inStock)
                  }>
                  Proceed to Checkout
                </Button>

                <div className='text-center space-y-2'>
                  <p className='text-xs text-muted-foreground'>
                    Secure checkout with 256-bit SSL encryption
                  </p>
                  <div className='flex justify-center gap-2 text-xs text-muted-foreground'>
                    <span>We accept:</span>
                    <span className='font-medium'>
                      Visa, Mastercard, PayPal, Apple Pay
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
