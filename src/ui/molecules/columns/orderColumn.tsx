import { OrderEntity } from "@/api";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/shadcn/dropdown-menu";
import { MoreHorizontal, Mail, Calendar, Eye, ArrowUpDown } from "lucide-react";
import { Badge } from "@/ui/shadcn/badge";

export const orderColumn = (
  onViewDetails: (order: OrderEntity) => void,
  handleOrderStatusUpdate: (orderId: string) => void
): ColumnDef<OrderEntity>[] => [
  {
    header: "SN",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => {
      const fullName = row.original.user.fullName || "N/A";
      console.log("row in orderColumn :", row.original);
      return <div className="font-medium">{fullName}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.user.email || "N/A";
      return (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "orderStatus",
    header: "Order Status",
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className="rounded-full px-2.5 py-0.5 text-xs font-medium border-gray-300 text-gray-700"
        >
          {row.getValue("orderStatus") || "N/A"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Payment Status",
    cell: ({ row }) => {
      return <Badge className="gap-1">{row.getValue("status") || "N/A"}</Badge>;
    },
  },
  {
    accessorKey: "deliveryMethod",
    header: "Delivery Method",
    cell: ({ row }) => {
      const deliveryMethod = row.getValue("deliveryMethod") as string;

      return <Badge>{deliveryMethod || "Local"}</Badge>;
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{date.toLocaleDateString()}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(order.user.email || "");
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Copy email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(order)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-yellow-600"
              onClick={() => handleOrderStatusUpdate(order?.id)}
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Update status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
