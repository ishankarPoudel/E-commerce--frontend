import { useEffect, useState } from "react";

import { EsewaPaymentForm } from "./EsewaForm";
import { useNavigate } from "@tanstack/react-router";

type EsewaCheckoutData = {
  provider: "esewa";
  orderId: string;
  formUrl: string;
  params: {
    amount: number;
    taxAmount: number;
    transaction_uuid: string;
    productCode: string;
    product_code: string | number | readonly string[] | undefined;
    product_delivery_charge: string | number | readonly string[] | undefined;
    product_service_charge: string | number | readonly string[] | undefined;
    total_amount: string | number | readonly string[] | undefined;
    successUrl: string;
    failureUrl: string;
    signed_field_names: string;
    signature: string;
  };
};

type CheckoutData = EsewaCheckoutData;

export const EsewaCheckoutPage = () => {
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("checkout");

    if (!stored) {
      navigate({ to: "/cart" });
      return;
    }

    try {
      const parsed = JSON.parse(stored) as CheckoutData;
      setCheckoutData(parsed);
    } catch {
      sessionStorage.removeItem("checkout");
      navigate({ to: "/cart" });
    }
  }, [navigate]);

  if (!checkoutData) {
    return <p>Preparing checkout...</p>;
  }

  if (checkoutData.provider === "esewa") {
    return (
      <EsewaPaymentForm
        formUrl={checkoutData.formUrl}
        params={checkoutData.params}
      />
    );
  }

  return <p>Unsupported payment provider</p>;
};
