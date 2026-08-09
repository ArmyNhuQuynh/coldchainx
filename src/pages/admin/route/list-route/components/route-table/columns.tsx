import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import type { TRoute } from "@/schemas/route.schema";
import { getRouteStatusLabel } from "@/types/enums/route-status.enum";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";

const getStatusBadge = (status: string | null | undefined) => {
  const statusLabel = getRouteStatusLabel(status);

  return <Badge className={statusLabel.className}>{statusLabel.label}</Badge>;
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("vi-VN");
};

export const columns: ColumnDef<TRoute>[] = [
  {
    accessorKey: "routeCode",
    header: ({ column }) =>
      createFormattedHeader("Mã tuyến", column, { align: "left" }),
    cell: ({ row }) => {
      const routeCode = row.original.routeCode;

      return createFormattedCell(
        <span className="font-semibold text-primary">{routeCode || "—"}</span>,
        { align: "left", tooltip: routeCode },
      );
    },
    size: 150,
  },
  {
    id: "route",
    header: ({ column }) =>
      createFormattedHeader("Tuyến", column, { align: "left" }),
    cell: ({ row }) => {
      const route = row.original;

      return createFormattedCell(
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{route.originCity || "—"}</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{route.destCity || "—"}</span>
        </div>,
        {
          align: "left",
          tooltip: `${route.originCity} -> ${route.destCity}`,
        },
      );
    },
    size: 300,
  },
  {
    accessorKey: "transitTime",
    header: ({ column }) =>
      createFormattedHeader("Thời gian", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(<span>{row.original.transitTime || "—"}</span>, {
        align: "center",
      }),
    size: 150,
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      createFormattedHeader("Trạng thái", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(getStatusBadge(row.original.status), {
        align: "center",
      }),
    size: 160,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) =>
      createFormattedHeader("Ngày tạo", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(<span>{formatDate(row.original.createdAt)}</span>, {
        align: "center",
      }),
    size: 150,
  },
];
