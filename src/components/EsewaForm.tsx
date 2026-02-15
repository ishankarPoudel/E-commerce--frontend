import { useEffect, useRef, useState } from "react";

interface EsewaPaymentFormProps {
  formUrl: string;
  params: Record<string, unknown>;
}

export const EsewaPaymentForm = ({
  formUrl,
  params,
}: EsewaPaymentFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const normalizedParams = Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (value === undefined || value === null) {
        throw new Error(`Missing eSewa field: ${key}`);
      }
      return [key, String(value)];
    }),
  ) as Record<string, string>;

  useEffect(() => {
    if (!formRef.current || submitted) return;

    const timer = setTimeout(() => {
      formRef.current?.submit();
      setSubmitted(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [submitted]);

  return (
    <>
      <h2>Connecting to eSewa</h2>
      <p>Securely redirecting you to complete your payment.</p>

      <form ref={formRef} action={formUrl} method="POST">
        {Object.entries(normalizedParams).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} readOnly />
        ))}
      </form>
    </>
  );
};
