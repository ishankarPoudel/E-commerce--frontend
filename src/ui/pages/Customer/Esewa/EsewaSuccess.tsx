import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { verifyEsewaPaymentMutation } from "@/api/@tanstack/react-query.gen";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/shadcn/card";
import { Button } from "@/ui/shadcn/button";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type UIState = "PENDING" | "COMPLETE" | "FAILED";

interface VerificationResponse {
  status: string; // "paid", "pending", "refunded", "failed"
  ref_id?: string;
  esewaStatus: string; // "COMPLETE", "PENDING", "CANCELED", etc.
  shouldRetry: boolean;
  orderId: string;
}

export const EsewaSuccessPage = () => {
  const [uiState, setUiState] = useState<UIState>("PENDING");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [transactionUuid, setTransactionUuid] = useState<string | null>(null);
  const { mutate: verifyPayment, isPending } = useMutation({
    ...verifyEsewaPaymentMutation(),
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("data");

    if (!encoded) {
      setUiState("FAILED");
      setMessage("Invalid payment response. No transaction data found.");
      toast.error("Payment verification failed");
      return;
    }

    const decoded = decodeEsewaData(encoded);

    if (!decoded?.transaction_uuid) {
      setUiState("FAILED");
      setMessage("Missing transaction reference. Please contact support.");
      toast.error("Invalid transaction data");
      return;
    }

    // Store transaction UUID for retry
    setTransactionUuid(decoded.transaction_uuid);

    // Verify payment once on page load
    handleVerifyPayment(decoded.transaction_uuid);
  }, []);

  const handleVerifyPayment = (uuid: string) => {
    setUiState("PENDING");
    setMessage("Verifying your payment with eSewa...");

    verifyPayment(
      {
        body: { esewaTransactionUuid: uuid },
      },
      {
        onSuccess: (res) => {
          const data = res.data as VerificationResponse;

          if (data.orderId) {
            setOrderId(data.orderId);
          }

          switch (data.esewaStatus) {
            case "COMPLETE":
              setUiState("COMPLETE");
              setMessage("Payment successful! Your order is confirmed.");
              toast.success("Payment verified successfully!");
              break;

            case "PENDING":
              setUiState("FAILED");
              setMessage(
                "Payment is still pending. Click 'Retry' to check again or contact support if issue persists.",
              );
              toast.warning("Payment still pending");
              break;

            case "FULL_REFUND":
            case "PARTIAL_REFUND":
              setUiState("FAILED");
              setMessage(
                `Payment was refunded (${data.esewaStatus}). Please contact support.`,
              );
              toast.error("Payment refunded");
              break;

            case "CANCELED":
              setUiState("FAILED");
              setMessage(
                "Payment was canceled. You can retry or place a new order.",
              );
              toast.error("Payment canceled");
              break;

            case "NOT_FOUND":
              setUiState("FAILED");
              setMessage(
                "Transaction not found. Please contact support if amount was deducted.",
              );
              toast.error("Transaction not found");
              break;

            case "AMBIGUOUS":
              setUiState("FAILED");
              setMessage(
                "Payment status is unclear. Please contact support immediately.",
              );
              toast.error("Ambiguous payment status");
              break;

            default:
              setUiState("FAILED");
              setMessage(
                `Payment verification failed. Status: ${data.esewaStatus}. Please contact support.`,
              );
              toast.error("Payment verification failed");
          }
        },
        onError: (error: Error) => {
          setUiState("FAILED");
          setMessage(
            error.message ||
              "Unable to verify payment. Please try again or contact support.",
          );
          toast.error("Payment verification error");
        },
      },
    );
  };

  const handleRetry = () => {
    if (transactionUuid) {
      handleVerifyPayment(transactionUuid);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {uiState === "PENDING" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
              <CardTitle>Verifying Payment</CardTitle>
            </>
          )}

          {uiState === "COMPLETE" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-600">
                Payment Successful!
              </CardTitle>
            </>
          )}

          {uiState === "FAILED" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-red-600">
                Verification Failed
              </CardTitle>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">{message}</p>

          <div className="flex flex-col gap-2">
            {uiState === "COMPLETE" && orderId && (
              <Button asChild className="w-full">
                <Link to={"/orders"}>View Order Details</Link>
              </Button>
            )}

            {uiState === "FAILED" && (
              <>
                <Button
                  onClick={handleRetry}
                  disabled={isPending}
                  className="w-full"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    "Retry Verification"
                  )}
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/orders">View My Orders</Link>
                </Button>
              </>
            )}

            <Button asChild variant="ghost" className="w-full">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function decodeEsewaData(encoded: string) {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}
