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

  useEffect(() => {
    const raw = sessionStorage.getItem("checkout");
    if (!raw) {
      navigate({ to: "/cart" });
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setClientSecret(parsed.clientSecret);
      setOrderId(parsed.orderId);
    } catch {
      navigate({ to: "/cart" });
    }
  }, [navigate]);

  const options = useMemo(
    () => (clientSecret ? { clientSecret } : undefined),
    [clientSecret]
  );

  if (!options || !orderId) {
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
