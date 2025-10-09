import { useEffect, useMemo, useState } from "react";
import { Button } from "@/ui/shadcn/button";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe will redirect here if 3DS or additional steps required
        return_url: `${window.location.origin}/checkout/result?orderId=${encodeURIComponent(
          orderId
        )}`,
      },
    });
    if (error) {
      toast.error(error.message || "Payment failed");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-md mx-auto space-y-4'>
      <PaymentElement options={{ layout: "tabs" }} />
      <Button type='submit' disabled={!stripe || submitting}>
        {submitting ? "Processing..." : "Pay now"}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isPickup, setIsPickup] = useState(false);
  const [pickupMessage, setPickupMessage] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("checkout");
    if (!raw) {
      navigate({ to: "/cart" });
      return;
    }
    try {
      const parsed = JSON.parse(raw);

      setOrderId(parsed.orderId ?? null);
      setClientSecret(parsed.clientSecret ?? null);

      const deliveryMethod = parsed.deliveryMethod as
        | "delivery"
        | "pickup"
        | undefined;
      if (deliveryMethod === "pickup" || !parsed.clientSecret) {
        setIsPickup(true);
        setPickupMessage(
          parsed.message ??
            "Your pickup order was received. Please pay in-store."
        );
      } else {
        setIsPickup(false);
      }
    } catch {
      navigate({ to: "/cart" });
    }
  }, [navigate]);

  const options = useMemo(
    () => (clientSecret ? { clientSecret } : undefined),
    [clientSecret]
  );

  // If we have neither orderId nor clientSecret, show loading/redirect
  if (!orderId) {
    return <div className='p-6 text-center'>Preparing checkout…</div>;
  }

  // PICKUP CASE: show confirmation UI and do NOT render Stripe
  if (isPickup && !clientSecret) {
    return (
      <div className='p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center'>
        <div className='mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-green-100'>
          <svg
            className='w-8 h-8 text-green-600'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M5 13l4 4L19 7'
            />
          </svg>
        </div>
        <h1 className='text-2xl font-bold mb-2 text-gray-900'>
          Pickup Order Confirmed
        </h1>
        <p className='mb-6 text-base text-gray-600'>
          {pickupMessage ??
            "We’ve received your pickup order. Please pay at the store when you collect your items."}
        </p>
        <div className='flex flex-col gap-3 w-full'>
          <Button
            className='w-full'
            onClick={() => {
              sessionStorage.removeItem("checkout");
              navigate({ to: `/orders/${orderId}` });
            }}>
            View Order
          </Button>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => {
              sessionStorage.removeItem("checkout");
              navigate({ to: "/" });
            }}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  // DELIVERY CASE: render Stripe Elements if clientSecret exists
  if (!options) {
    // clientSecret not set yet (or missing) — show preparing
    return <div className='p-6 text-center'>Preparing checkout…</div>;
  }

  return (
    <div className='p-6'>
      <h1 className='text-xl font-semibold mb-4'>Secure Payment</h1>
      <Elements stripe={stripePromise} options={options}>
        <PaymentForm orderId={orderId} />
      </Elements>
    </div>
  );
}
