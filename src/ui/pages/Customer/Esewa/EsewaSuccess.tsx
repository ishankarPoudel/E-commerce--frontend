import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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
  const navigate = useNavigate();
  const [uiState, setUiState] = useState<UIState>("PENDING");
  const [message, setMessage] = useState("Verifying payment, please wait...");
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);
  const [orderId, setOrderId] = useState<string | null>(null);

  //mutation to verify esewa payment
  const { mutate: verifyPayment } = useMutation({
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
    console.log("Decoded eSewa data:", decoded);

    if (!decoded?.transaction_uuid) {
      setUiState("FAILED");
      setMessage("Missing transaction reference. Please contact support.");
      toast.error("Invalid transaction data");
      return;
    }

    // Start verification
    verifyWithRetry(decoded.transaction_uuid);
  }, []);

  const verifyWithRetry = async (
    transactionUuid: string,
    attempts = 3,
    delayMs = 3000
  ) => {
    for (let i = 1; i <= attempts; i++) {
      setRetryCount(i);
      setMessage(`Verifying your payment... (Attempt ${i} of ${attempts})`);

      try {
        const result = await new Promise<VerificationResponse>(
          (resolve, reject) => {
            verifyPayment(
              {
                body: { esewaTransactionUuid: transactionUuid },
              },
              {
                onSuccess: (res) => {
                  console.log("Verification response:", res.data);

                  const data = res.data as VerificationResponse;

                  // Store order ID for navigation
                  if (data.orderId) {
                    setOrderId(data.orderId);
                  }

                  resolve(data);
                },
                onError: (error: Error) => {
                  console.error("Verification error:", error);
                  reject(error);
                },
              }
            );
          }
        );

        // ✅ Handle different eSewa statuses
        switch (result.esewaStatus) {
          case "COMPLETE":
            setUiState("COMPLETE");
            setMessage("Payment successful! Your order is confirmed.");
            toast.success("Payment verified successfully!");
            return; // Exit retry loop

          case "PENDING":
            if (i < attempts) {
              setMessage(
                `Payment is being processed by eSewa. Checking again in ${
                  delayMs / 1000
                } seconds... (${i}/${attempts})`
              );
              await wait(delayMs);
              continue; // Try again
            } else {
              // Max retries reached but still pending
              setUiState("FAILED");
              setMessage(
                "Payment verification is taking longer than expected. Please check your order status in 'My Orders' or contact support."
              );
              toast.warning(
                "Verification timeout - Please check your orders page"
              );
              return;
            }

          case "FULL_REFUND":
          case "PARTIAL_REFUND":
            setUiState("FAILED");
            setMessage(
              `Payment was refunded (${result.esewaStatus}). If this is unexpected, please contact support.`
            );
            toast.error("Payment refunded");
            return;

          case "CANCELED":
            setUiState("FAILED");
            setMessage(
              "Payment was canceled. You can try placing the order again."
            );
            toast.error("Payment canceled");
            return;

          case "NOT_FOUND":
            setUiState("FAILED");
            setMessage(
              "Transaction not found in eSewa system. Please contact support if amount was deducted."
            );
            toast.error("Transaction not found");
            return;

          case "AMBIGUOUS":
            setUiState("FAILED");
            setMessage(
              "Payment status is unclear. Please contact support immediately with your transaction reference."
            );
            toast.error("Ambiguous payment status");
            return;

          default:
            setUiState("FAILED");
            setMessage(
              `Payment verification failed with status: ${result.esewaStatus}. Please contact support.`
            );
            toast.error("Payment verification failed");
            return;
        }
      } catch (error) {
        console.error(`Verification attempt ${i} failed:`, error);

        if (i === attempts) {
          // Final attempt failed
          setUiState("FAILED");
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to verify payment after multiple attempts. Please check your order status or contact support."
          );
          toast.error("Payment verification error");
          return;
        } else {
          // Will retry
          setMessage(
            `Connection issue. Retrying in ${
              delayMs / 1000
            } seconds... (${i}/${attempts})`
          );
          await wait(delayMs);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-4">
          {/* Icon based on state */}
          <div className="flex justify-center mb-4">
            {uiState === "PENDING" && (
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse" />
              </div>
            )}
            {uiState === "COMPLETE" && (
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-scale-in">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            )}
            {uiState === "FAILED" && (
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-shake">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            )}
          </div>

          <CardTitle className="text-2xl font-playfair">
            {uiState === "PENDING" && "Verifying Payment"}
            {uiState === "COMPLETE" && "Payment Successful!"}
            {uiState === "FAILED" && "Payment Verification Failed"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Message */}
          <div className="text-center space-y-2">
            <p className="text-slate-600 leading-relaxed">{message}</p>

            {/* Order ID display */}
            {orderId && uiState !== "PENDING" && (
              <div className="mt-3 p-3 bg-slate-100 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Order Reference</p>
                <p className="text-sm font-mono text-slate-700 break-all">
                  {orderId}
                </p>
              </div>
            )}

            {/* Progress indicator for verifying state */}
            {uiState === "PENDING" && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Attempt {retryCount}</span>
                  <span>
                    {retryCount} of {maxRetries}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(retryCount / maxRetries) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Success state content */}
          {uiState === "COMPLETE" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Order Confirmed</p>
                  <p className="text-green-700">
                    Your payment has been processed successfully. You will
                    receive an order confirmation email shortly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Failed state content */}
          {uiState === "FAILED" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">What to do next?</p>
                  <ul className="text-red-700 space-y-1 list-disc list-inside">
                    <li>Check your eSewa transaction history</li>
                    <li>
                      If amount was deducted, check 'My Orders' page or contact
                      support
                    </li>
                    <li>Otherwise, you can try placing the order again</li>
                    {orderId && (
                      <li className="font-medium">
                        Reference this Order ID: {orderId.slice(0, 8)}...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3 pt-4">
            {uiState === "COMPLETE" && (
              <>
                <Button
                  onClick={() =>
                    navigate({
                      to: orderId ? `/orders/${orderId}` : "/orders",
                    })
                  }
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {orderId ? "View Order Details" : "View My Orders"}
                </Button>
                <Button
                  onClick={() => navigate({ to: "/" })}
                  variant="outline"
                  className="w-full h-11 border-slate-300 hover:bg-slate-50"
                >
                  Continue Shopping
                </Button>
              </>
            )}

            {uiState === "FAILED" && (
              <>
                {/* Show different primary action based on whether we have orderId */}
                {orderId ? (
                  <Button
                    onClick={() => navigate({ to: "/orders" })}
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Check My Orders
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate({ to: "/cart" })}
                    className="w-full h-11 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Back to Cart
                  </Button>
                )}
                <Button
                  onClick={() => {
                    // Create mailto link with pre-filled subject and body
                    const subject = encodeURIComponent(
                      "eSewa Payment Issue - Order " + (orderId || "Unknown")
                    );
                    const body = encodeURIComponent(
                      `Order ID: ${
                        orderId || "N/A"
                      }\n\nIssue: ${message}\n\nPlease help me resolve this issue.`
                    );
                    window.location.href = `mailto:support@yourstore.com?subject=${subject}&body=${body}`;
                  }}
                  variant="outline"
                  className="w-full h-11 border-slate-300 hover:bg-slate-50"
                >
                  Contact Support
                </Button>
              </>
            )}

            {uiState === "PENDING" && (
              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Please don't close this page or refresh
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  This verification may take up to 10 seconds
                </p>
              </div>
            )}
          </div>

          {/* Support info */}
          {uiState === "FAILED" && (
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Need immediate help? Email us at{" "}
                <a
                  href="mailto:support@yourstore.com"
                  className="text-blue-600 hover:underline font-medium"
                >
                  support@yourstore.com
                </a>
                {orderId && (
                  <>
                    <br />
                    <span className="font-mono text-slate-600">
                      Ref: {orderId.slice(0, 12)}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add CSS for animations */}
      <style>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
