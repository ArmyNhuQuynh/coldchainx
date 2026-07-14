import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRoute } from "@/hooks/use-route";
import { handleApiError } from "@/lib/error";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import type { TRoute } from "@/schemas/route.schema";
import { getRouteStatusLabel } from "@/types/enums/route-status.enum";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, Eye, Pencil, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

const ActionCell = ({ route }: { route: TRoute }) => {
  const navigate = useNavigate();
  const { deleteRoute } = useRoute();

  const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const confirmed = window.confirm(`Xóa tuyến ${route.routeCode}?`);
    if (!confirmed) return;

    try {
      await deleteRoute.mutateAsync(route.routeId);
      toast.success("Xóa tuyến thành công");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleNavigate = (
    event: MouseEvent<HTMLButtonElement>,
    target: string
  ) => {
    event.stopPropagation();
    navigate(target);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-9 rounded-xl px-3"
        onClick={(event) =>
          handleNavigate(event, PATH_ADMIN_DASHBOARD.route.detail(route.routeId))
        }
      >
        <Eye className="mr-2 h-4 w-4" />
        Chi tiết
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(event) =>
          handleNavigate(event, PATH_ADMIN_DASHBOARD.route.edit(route.routeId))
        }
      >
        <Pencil className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        disabled={deleteRoute.isPending}
        onClick={handleDelete}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
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
        { align: "left", tooltip: routeCode }
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
        }
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
  {
    id: "actions",
    header: ({ column }) =>
      createFormattedHeader("Hành động", column, { align: "center" }),
    cell: ({ row }) => <ActionCell route={row.original} />,
    size: 230,
  },
];
