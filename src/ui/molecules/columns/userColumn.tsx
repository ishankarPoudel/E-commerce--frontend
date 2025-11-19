import { UserEntity } from "@/api";
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
import {
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Mail,
  Calendar,
  Shield,
  Trash2,
  Eye,
  Unlock,
} from "lucide-react";
import { Badge } from "@/ui/shadcn/badge";

export const userColumn = (
  onViewDetails: (user: UserEntity) => void,
  handleUserBan: (userId: string) => void,
  handleUserUnban: (userId: string) => void
): ColumnDef<UserEntity>[] => [
  {
    header: "SN",
    cell: ({ row }) => (
      <div className="font-medium text-muted-foreground">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("fullName") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{row.getValue("email")}</span>
      </div>
    ),
  },
  {
    accessorKey: "isEmailVerified",
    header: "Email Verified",
    cell: ({ row }) => {
      const isVerified = row.getValue("isEmailVerified");
      return (
        <Badge
          variant={isVerified ? "default" : "destructive"}
          className="gap-1"
        >
          {isVerified ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </>
          ) : (
            <>
              <XCircle className="h-3 w-3" />
              Not Verified
            </>
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => {
      const provider = row.getValue("provider") as string;
      const isOauth = row.original.isOauth;

      return (
        <Badge variant={isOauth ? "secondary" : "outline"}>
          {provider || "Local"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isBanned",
    header: "Status",
    cell: ({ row }) => {
      const isBanned = row.getValue("isBanned");
      console.log("isBanned:", isBanned);
      return (
        <Badge variant={isBanned ? "destructive" : "default"} className="gap-1">
          {isBanned ? (
            <>
              <XCircle className="h-3 w-3" />
              Banned
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Active
            </>
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "deviceInfo",
    header: "Device Info",
    cell: ({ row }) => {
      const deviceInfo = row.original.deviceInfo;

      if (!deviceInfo) {
        return (
          <span className="text-xs text-muted-foreground italic">
            Not available
          </span>
        );
      }

      return (
        <div className="text-xs space-y-1">
          <div className="font-medium">{deviceInfo.device || "Unknown"}</div>
          <div className="text-muted-foreground">
            {deviceInfo.os} • {deviceInfo.browser}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined At",
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
      const user = row.original;

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
              onClick={() => navigator.clipboard.writeText(user.email)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Copy email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewDetails(user)}>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              View orders
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => handleUserBan(user.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Ban user
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-green-600"
              onClick={() => handleUserUnban(user.id)}
            >
              <Unlock className="mr-2 h-4 w-4" />
              Unban user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
