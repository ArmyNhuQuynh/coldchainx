import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TDiscrepancyTableRow } from "@/schemas/discrepancy.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusMap: Record<string, { label: string; className: string }> = {
  DISCREPANCY_HOLD: {
    label: "Đang giữ",
    className: "text-rose-700 bg-rose-50 border border-rose-200",
  },
};

const ActionCell = ({ row }: { row: TDiscrepancyTableRow }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="h-9 px-3 rounded-xl"
              onClick={(event) => {
                event.stopPropagation();
                navigate(row.lpnId);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Chi tiết
            </Button>
          </TooltipTrigger>
          <TooltipContent>Xem chi tiết sai lệch</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button variant="ghost" size="icon" onClick={(event) => event.stopPropagation()}>
        <MoreHorizontal className="h-5 w-5" />
      </Button>
    </div>
  );
};

export const incidentColumns: ColumnDef<TDiscrepancyTableRow>[] = [
  {
    accessorKey: "trackingCode",
    header: ({ column }) =>
      createFormattedHeader("Tracking", column, { align: "left" }),
    cell: ({ row }) => {
      const trackingCode = row.getValue("trackingCode") as string;

      return createFormattedCell(
        <span className="font-semibold text-primary">{trackingCode}</span>,
        { align: "left", tooltip: trackingCode }
      );
    },
    size: 180,
  },
  {
    accessorKey: "customerName",
    header: ({ column }) =>
      createFormattedHeader("Customer", column, { align: "left" }),
    cell: ({ row }) => {
      const customerName = (row.getValue("customerName") as string) || "—";

      return createFormattedCell(
        <span className="font-semibold">{customerName}</span>,
        { align: "left", tooltip: customerName }
      );
    },
    size: 190,
  },
  {
    accessorKey: "itemName",
    header: ({ column }) =>
      createFormattedHeader("Item", column, { align: "left" }),
    cell: ({ row }) => {
      const itemName = row.getValue("itemName") as string;
      return createFormattedCell(itemName, {
        align: "left",
        tooltip: itemName,
      });
    },
    size: 190,
  },
  {
    accessorKey: "diffPercent",
    header: ({ column }) =>
      createFormattedHeader("Diff %", column, { align: "center" }),
    cell: ({ row }) => {
      const diffPercent = row.getValue("diffPercent") as number;

      return createFormattedCell(
        <Badge className="border border-rose-200 bg-rose-50 text-rose-700">
          {diffPercent.toFixed(2)}%
        </Badge>,
        { align: "center" }
      );
    },
    size: 120,
  },
  {
    accessorKey: "discrepancyReason",
    header: ({ column }) =>
      createFormattedHeader("Reason", column, { align: "left" }),
    cell: ({ row }) => {
      const reason = (row.getValue("discrepancyReason") as string) || "—";

      return createFormattedCell(reason, {
        align: "left",
        maxWidth: "360px",
        truncate: true,
        tooltip: reason,
      });
    },
    size: 360,
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      createFormattedHeader("Status", column, { align: "center" }),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const cfg = statusMap[status] ?? {
        label: status,
        className: "text-neutral-600 bg-neutral-50 border border-neutral-200",
      };

      return createFormattedCell(
        <Badge className={`${cfg.className} hover:opacity-90`}>
          {cfg.label}
        </Badge>,
        { align: "center" }
      );
    },
    size: 140,
  },
  {
    id: "actions",
    header: ({ column }) =>
      createFormattedHeader("Hành động", column, { align: "center" }),
    cell: ({ row }) => <ActionCell row={row.original} />,
    size: 180,
  },
];
