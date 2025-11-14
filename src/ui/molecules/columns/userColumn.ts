import { UserEntity } from "@/api";
import { ColumnDef } from "@tanstack/react-table";

export const userColumn: ColumnDef<UserEntity>[] = [
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => row.getValue("fullName"),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email"),
  },
  {
    accessorKey: "isEmailVerified",
    header: "Email Verified",
    cell: ({ row }) =>
      row.getValue("isEmailVerified") ? "Verified" : "Not Verified",
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => row.getValue("provider"),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
];
