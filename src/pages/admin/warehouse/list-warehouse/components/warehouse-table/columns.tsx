import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import type { TWarehouse } from "@/schemas/warehouse.schema";
import { getWarehouseStatusLabel } from "@/types/enums/warehouse-status.enum";
import { getWarehouseTypeLabel } from "@/types/enums/warehouse-type.enum";
import type { ColumnDef } from "@tanstack/react-table";

const getStatusBadge = (status: string | null | undefined) => {
  const statusLabel = getWarehouseStatusLabel(status);

  return <Badge className={statusLabel.className}>{statusLabel.label}</Badge>;
};

const formatTemperature = (min?: number | null, max?: number | null) => {
  if (min === null || min === undefined || max === null || max === undefined) {
    return "—";
  }

  return `${min}°C - ${max}°C`;
};

export const columns: ColumnDef<TWarehouse>[] = [
  {
    accessorKey: "warehouseCode",
    header: ({ column }) =>
      createFormattedHeader("Mã kho", column, { align: "left" }),
    cell: ({ row }) => {
      const code = row.original.warehouseCode;

      return createFormattedCell(
        <span className="font-semibold text-primary">{code || "—"}</span>,
        { align: "left", tooltip: code },
      );
    },
    size: 150,
  },
  {
    accessorKey: "warehouseName",
    header: ({ column }) =>
      createFormattedHeader("Kho", column, { align: "left" }),
    cell: ({ row }) => {
      const warehouse = row.original;

      return createFormattedCell(
        <div className="flex flex-col">
          <span className="font-semibold">
            {warehouse.warehouseName || "—"}
          </span>
          <span className="text-xs text-muted-foreground">
            {warehouse.address || "Chưa có địa chỉ"}
          </span>
        </div>,
        { align: "left", tooltip: warehouse.warehouseName },
      );
    },
    size: 280,
  },
  {
    accessorKey: "warehouseType",
    header: ({ column }) =>
      createFormattedHeader("Loại kho", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(
        <span>{getWarehouseTypeLabel(row.original.warehouseType)}</span>,
        { align: "center" },
      ),
    size: 150,
  },
  {
    id: "capacity",
    header: ({ column }) =>
      createFormattedHeader("Pallet", column, { align: "center" }),
    cell: ({ row }) => {
      const { currentPallets, maxPallets } = row.original;

      return createFormattedCell(
        <span>
          {(currentPallets ?? 0).toLocaleString("vi-VN")} /{" "}
          {maxPallets.toLocaleString("vi-VN")}
        </span>,
        { align: "center" },
      );
    },
    size: 140,
  },
  {
    id: "temperature",
    header: ({ column }) =>
      createFormattedHeader("Dải nhiệt", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(
        <span>
          {formatTemperature(
            row.original.defaultMinTemp,
            row.original.defaultMaxTemp,
          )}
        </span>,
        { align: "center" },
      ),
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
];
