import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Receipt,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/ui/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/ui/shadcn/card";
import { Separator } from "@radix-ui/react-separator";
import { Badge } from "@/ui/shadcn/badge";

import { getOrderByIdOptions } from "@/api/@tanstack/react-query.gen";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";

export function ResultPage() {
  const sp = new URLSearchParams(window.location.search);
  const orderId = (sp.get("orderId") as string) || "";

  useEffect(() => {
    const clean = orderId
      ? `/checkout/result?orderId=${encodeURIComponent(orderId)}`
      : "/checkout/result";
    if (window.location.search !== clean.split("?")[1]) {
      window.history.replaceState(null, "", clean);
    }
  }, [orderId]);

  const {
    data: payment,
    isLoading,
    error,
    refetch,
  } = useQuery({
    enabled: Boolean(orderId),
    ...getOrderByIdOptions({
      body: { orderId },
    }),
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className='h-16 w-16 text-green-500' />;
      case "failed":
        return <XCircle className='h-16 w-16 text-destructive' />;
      case "pending":
        return <Clock className='h-16 w-16 text-amber-500' />;
      default:
        return <XCircle className='h-16 w-16 text-muted-foreground' />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "paid":
        return {
          title: "Payment Successful!",
          description: "Your payment has been processed successfully.",
          className: "text-green-600",
        };
      case "failed":
        return {
          title: "Payment Failed",
          description:
            "We were unable to process your payment. Please try again.",
          className: "text-destructive",
        };
      case "pending":
        return {
          title: "Payment Pending",
          description: "Your payment is being processed. Please wait a moment.",
          className: "text-amber-600",
        };
      default:
        return {
          title: "Payment Status Unknown",
          description: "We could not determine the status of your payment.",
          className: "text-muted-foreground",
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
            Completed
          </Badge>
        );
      case "failed":
        return <Badge variant='destructive'>Failed</Badge>;
      case "pending":
        return (
          <Badge className='bg-amber-100 text-amber-800 hover:bg-amber-100'>
            Processing
          </Badge>
        );
      default:
        return <Badge variant='secondary'>Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4'></div>
            <p className='text-muted-foreground'>Validating payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardContent className='flex flex-col items-center justify-center py-12 space-y-4'>
            <XCircle className='h-16 w-16 text-destructive' />
            <div className='text-center'>
              <h2 className='text-xl font-semibold text-foreground mb-2'>
                Validation Error
              </h2>
              <p className='text-muted-foreground mb-4'>
                Unable to validate payment status
              </p>
              <Button
                onClick={() => refetch()}
                variant='outline'
                className='gap-2'>
                <RefreshCw className='h-4 w-4' />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!payment) return null;

  const statusInfo = getStatusMessage(payment.data.status);

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl space-y-6'>
        {/* Status Header */}
        <Card className='text-center'>
          <CardContent className='py-12'>
            <div className='flex flex-col items-center space-y-4'>
              {getStatusIcon(payment.data.status)}
              <div className='space-y-2'>
                <h1
                  className={cn(
                    "text-3xl font-bold text-balance",
                    statusInfo.className
                  )}>
                  {statusInfo.title}
                </h1>
                <p className='text-lg text-muted-foreground text-pretty'>
                  {statusInfo.description}
                </p>
                {getStatusBadge(payment.data.status)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Receipt className='h-5 w-5' />
              Payment Details
            </CardTitle>
            <CardDescription>
              Transaction information and receipt
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-muted-foreground'>
                  Amount
                </p>
                <p className='text-2xl font-bold text-foreground'>
                  ${payment.data.amount.toFixed(2)} {payment.data.currency}
                </p>
              </div>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-muted-foreground'>
                  Transaction ID
                </p>
                <p className='text-sm font-mono text-foreground break-all'>
                  {payment.data.id || "N/A"}
                </p>
              </div>
            </div>

            <Separator />

            <div className='space-y-2'>
              <p className='text-sm font-medium text-muted-foreground'>
                Processed At
              </p>
              <p className='text-sm text-foreground'>
                {new Date(payment.data.createdAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <Link to='/'>
            <Button variant='outline' className='gap-2 bg-transparent'>
              <ArrowLeft className='h-4 w-4' />
              Back to Home
            </Button>
          </Link>

          {payment.data.status === "paid" && (
            <Button className='gap-2'>
              <Receipt className='h-4 w-4' />
              Download Receipt
            </Button>
          )}

          {payment.data.status === "failed" && (
            <Button className='gap-2'>
              <RefreshCw className='h-4 w-4' />
              Retry Payment
            </Button>
          )}

          {payment.data.status === "pending" && (
            <Button
              onClick={() => refetch()}
              variant='outline'
              className='gap-2'>
              <RefreshCw className='h-4 w-4' />
              Check Status
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
