import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/ui/shadcn/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shadcn/select";
import { Button } from "@/ui/shadcn/button";
import { Badge } from "@/ui/shadcn/badge";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { useMutation } from "@tanstack/react-query";
import { updateOrderStatusMutation } from "@/api/@tanstack/react-query.gen";
import { toast } from "sonner";

interface UpdateOrderStatusProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const ORDER_STATUSES = [
  {
    value: "new",
    label: "New",
    description: "Order has just arrived and is awaiting review.",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    value: "processing",
    label: "Processing",
    description: "Order has been reviewed and is being prepared.",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    description: "Order was cancelled by user or admin.",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  {
    value: "completed",
    label: "Completed",
    description: "Order has been delivered or finalized.",
    color: "bg-green-100 text-green-700 border-green-200",
  },
] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number]["value"];

export function UpdateOrderStatus({
  orderId,
  currentStatus,
  open,
  onOpenChange,
}: UpdateOrderStatusProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [status, setStatus] = useState<OrderStatus>("new");

  const {
    mutate: updateOrderStatus,
    isPending,
    refetch,
  } = useMutation({
    ...updateOrderStatusMutation(),
  });

  const handleUpdate = async () => {
    updateOrderStatus(
      {
        body: { status, orderId },
      },
      {
        onSuccess: (response) => {
          toast.success(
            response.message || "Order status updated successfully."
          );
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to update order status. Please try again.");
        },
      }
    );
  };

  const selectedInfo = ORDER_STATUSES.find((s) => s.value === status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl border border-neutral-200 shadow-xl animate-in fade-in-0 zoom-in-95">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            Update Order Status
          </DialogTitle>
          <p className="text-sm text-neutral-500">
            Change the order’s lifecycle status. This helps manage workflow and
            customer notifications.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Select new status</p>

            <Select
              value={status}
              onValueChange={(value) => setStatus(value as OrderStatus)}
            >
              <SelectTrigger className="w-full rounded-xl border-neutral-300">
                <SelectValue placeholder="Choose status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Preview */}
          {selectedInfo && (
            <div className="rounded-xl border p-3 bg-neutral-50">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className={clsx(
                    "capitalize border px-2 py-0.5 text-xs font-medium",
                    selectedInfo.color
                  )}
                >
                  {selectedInfo.label}
                </Badge>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {selectedInfo.description}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleUpdate}
            disabled={isPending || !status || status === currentStatus}
            className="w-full rounded-xl"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status === currentStatus ? (
              "No Changes Detected"
            ) : (
              "Update Status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
