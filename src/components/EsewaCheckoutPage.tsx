import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { EsewaPaymentForm } from "./EsewaForm";

export const EsewaCheckoutPage = () => {
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("checkout");

    if (!stored) {
      navigate({ to: "/cart" });
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      if (
        parsed.provider !== "esewa" ||
        !parsed.formUrl ||
        !parsed.params?.signature ||
        !parsed.params?.transaction_uuid
      ) {
        throw new Error("Invalid checkout payload");
      }

      setCheckoutData(parsed);
    } catch (err) {
      console.error("Invalid checkout data:", err);
      sessionStorage.removeItem("checkout");
      setError("Your checkout session expired. Please try again.");
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="checkout-error">
        <h2>Checkout Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate({ to: "/cart" })}>
          Return to cart
        </button>
      </div>
    );
  }

  if (!checkoutData) {
    return (
      <div className="checkout-loading">
        <h2>Redirecting to eSewa…</h2>
        <p>Please do not refresh or close this page.</p>
      </div>
    );
  }

  return (
    <EsewaPaymentForm
      formUrl={checkoutData.formUrl}
      params={checkoutData.params}
    />
  );
};
