import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TUserProfile } from "@/schemas/user.schema";
import { formatUserDate } from "../../components/user-formatters";
import {
  getUserRoleClassName,
  getUserRoleLabel,
} from "@/types/enums/user-role.enum";
import { getUserStatusLabel } from "@/types/enums/user-status.enum";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserActionCell = ({ user }: { user: TUserProfile }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <Button
        type="button"
        variant="outline"
        className="h-9 rounded-xl px-3"
        onClick={() => navigate(user.userId)}
      >
        <Eye className="mr-2 h-4 w-4" />
        Chi tiết
      </Button>
    </div>
  );
};

export const columns: ColumnDef<TUserProfile>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) =>
      createFormattedHeader("Người dùng", column, { align: "left" }),
    cell: ({ row }) => {
      const user = row.original;

      return createFormattedCell(
        <div className="flex flex-col">
          <span className="font-semibold text-primary">
            {user.fullName || "—"}
          </span>
          <span className="text-xs text-muted-foreground">
            {user.username || "—"}
          </span>
        </div>,
        { align: "left", tooltip: user.fullName }
      );
    },
    size: 240,
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      createFormattedHeader("Email", column, { align: "left" }),
    cell: ({ row }) =>
      createFormattedCell(<span>{row.original.email || "—"}</span>, {
        align: "left",
        tooltip: row.original.email || undefined,
      }),
    size: 230,
  },
  {
    accessorKey: "role",
    header: ({ column }) =>
      createFormattedHeader("Role", column, { align: "center" }),
    cell: ({ row }) => {
      const role = row.original.role;

      return createFormattedCell(
        <Badge className={getUserRoleClassName(role)}>
          {getUserRoleLabel(role)}
        </Badge>,
        { align: "center" }
      );
    },
    size: 170,
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      createFormattedHeader("Trạng thái", column, { align: "center" }),
    cell: ({ row }) => {
      const status = getUserStatusLabel(row.original.status);

      return createFormattedCell(
        <Badge className={status.className}>{status.label}</Badge>,
        { align: "center" }
      );
    },
    size: 160,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) =>
      createFormattedHeader("Ngày tạo", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(<span>{formatUserDate(row.original.createdAt)}</span>, {
        align: "center",
      }),
    size: 170,
  },
  {
    id: "actions",
    header: ({ column }) =>
      createFormattedHeader("Hành động", column, { align: "center" }),
    cell: ({ row }) => <UserActionCell user={row.original} />,
    size: 150,
  },
];
