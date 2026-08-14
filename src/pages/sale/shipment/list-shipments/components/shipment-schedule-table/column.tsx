import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import type { TOrderScheduleSummary } from "@/schemas/order.schema";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

const trimTime = (value: string) => value.slice(0, 5);

export const scheduleColumns: ColumnDef<TOrderScheduleSummary>[] = [
  {
    id: "route",
    header: ({ column }) =>
      createFormattedHeader("Tuyến vận chuyển", column, { align: "left" }),
    cell: ({ row }) =>
      createFormattedCell(
        <div className="min-w-0">
          <p className="truncate font-semibold">
            {row.original.originCity} → {row.original.destCity}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {row.original.routeCode}
          </p>
        </div>,
        { align: "left", maxWidth: "230px" }
      ),
    size: 230,
  },
  {
    id: "schedule",
    header: ({ column }) =>
      createFormattedHeader("Lịch vận chuyển", column, { align: "left" }),
    cell: ({ row }) =>
      createFormattedCell(
        <div>
          <p className="font-medium">{row.original.scheduleName}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(row.original.departureDate), "dd/MM/yyyy")}
          </p>
        </div>,
        { align: "left", maxWidth: "200px" }
      ),
    size: 200,
  },
  {
    id: "time",
    header: ({ column }) =>
      createFormattedHeader("Cut-off / Khởi hành", column, { align: "left" }),
    cell: ({ row }) =>
      createFormattedCell(
        <div className="space-y-1 text-sm">
          <p>Cut-off {trimTime(row.original.cutOffTime)}</p>
          <p className="text-muted-foreground">
            Đi {trimTime(row.original.departureTime)} · {format(new Date(row.original.departureDate), "dd/MM")}
          </p>
        </div>,
        { align: "left", maxWidth: "190px" }
      ),
    size: 190,
  },
  {
    accessorKey: "totalOrders",
    header: ({ column }) =>
      createFormattedHeader("Tổng đơn", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(
        <span className="text-base font-semibold">{row.original.totalOrders}</span>,
        { align: "center" }
      ),
    size: 90,
  },
  {
    id: "workflow",
    header: ({ column }) =>
      createFormattedHeader("Đơn cần Sale xử lý", column, { align: "left" }),
    cell: ({ row }) => (
      <div className="flex min-w-[250px] flex-wrap gap-1.5 py-1">
        <Badge variant="outline" className="border-amber-300 text-amber-700">
          Chờ duyệt: {row.original.pendingReviewCount}
        </Badge>
        <Badge variant="outline" className="border-blue-300 text-blue-700">
          Chờ báo giá: {row.original.waitingQuotationCount}
        </Badge>
        <Badge variant="outline" className="border-violet-300 text-violet-700">
          Chờ hợp đồng: {row.original.waitingContractCount}
        </Badge>
      </div>
    ),
    size: 300,
  },
];
