import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import type { TIotDevice } from "@/schemas/iot-device.schema";
import { getIotDeviceUnifiedStatusLabel } from "@/types/enums/iot-device-status.enum";
import type { ColumnDef } from "@tanstack/react-table";

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("vi-VN");
};

const getDeviceStatusBadge = (device: TIotDevice) => {
  const status = getIotDeviceUnifiedStatusLabel(device);
  return <Badge className={status.className}>{status.label}</Badge>;
};

export const columns: ColumnDef<TIotDevice>[] = [
  {
    accessorKey: "deviceCode",
    header: ({ column }) =>
      createFormattedHeader("Mã thiết bị", column, { align: "left" }),
    cell: ({ row }) =>
      createFormattedCell(
        <span className="font-semibold text-primary">
          {row.original.deviceCode || "—"}
        </span>,
        { align: "left", tooltip: row.original.deviceCode ?? undefined },
      ),
    size: 180,
  },
  {
    id: "vehicle",
    header: ({ column }) =>
      createFormattedHeader("Xe đang gắn", column, { align: "left" }),
    cell: ({ row }) =>
      createFormattedCell(
        <span className="font-medium">
          {row.original.vehicleId
            ? row.original.truckPlate || "Đã gắn xe"
            : "Chưa gắn xe"}
        </span>,
        {
          align: "left",
          tooltip: row.original.truckPlate || undefined,
        },
      ),
    size: 190,
  },
  {
    id: "deviceStatus",
    header: ({ column }) =>
      createFormattedHeader("Tình trạng thiết bị", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(getDeviceStatusBadge(row.original), {
        align: "center",
      }),
    size: 180,
  },
  {
    accessorKey: "batteryLevel",
    header: ({ column }) =>
      createFormattedHeader("Pin", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(
        <span>
          {row.original.batteryLevel === null ||
          row.original.batteryLevel === undefined
            ? "—"
            : `${row.original.batteryLevel}%`}
        </span>,
        { align: "center" },
      ),
    size: 100,
  },
  {
    accessorKey: "lastPingTime",
    header: ({ column }) =>
      createFormattedHeader("Ping cuối", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(
        <span>{formatDate(row.original.lastPingTime)}</span>,
        {
          align: "center",
        },
      ),
    size: 190,
  },
];
