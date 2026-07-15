import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIotDevice } from "@/hooks/use-iot-device";
import { handleApiError } from "@/lib/error";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import type { TIotDevice } from "@/schemas/iot-device.schema";
import { getIotDeviceStatusLabel } from "@/types/enums/iot-device-status.enum";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("vi-VN");
};

const getStatusBadge = (status?: string | null) => {
  const statusLabel = getIotDeviceStatusLabel(status);
  return <Badge className={statusLabel.className}>{statusLabel.label}</Badge>;
};

const ActionCell = ({ device }: { device: TIotDevice }) => {
  const navigate = useNavigate();
  const { deleteIotDevice } = useIotDevice();

  const handleNavigate = (
    event: MouseEvent<HTMLButtonElement>,
    target: string
  ) => {
    event.stopPropagation();
    navigate(target);
  };

  const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      `Xóa thiết bị ${device.deviceCode || device.deviceId}?`
    );
    if (!confirmed) return;

    try {
      await deleteIotDevice.mutateAsync(device.deviceId);
      toast.success("Xóa thiết bị IoT thành công");
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-9 rounded-xl px-3"
        onClick={(event) =>
          handleNavigate(
            event,
            PATH_ADMIN_DASHBOARD.iotDevice.detail(device.deviceId)
          )
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
          handleNavigate(
            event,
            PATH_ADMIN_DASHBOARD.iotDevice.edit(device.deviceId)
          )
        }
      >
        <Pencil className="h-5 w-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        disabled={deleteIotDevice.isPending}
        onClick={handleDelete}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
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
        { align: "left", tooltip: row.original.deviceCode ?? undefined }
      ),
    size: 180,
  },
  {
    id: "vehicle",
    header: ({ column }) =>
      createFormattedHeader("Xe đang gắn", column, { align: "left" }),
    cell: ({ row }) =>
      createFormattedCell(
        <div className="flex flex-col">
          <span className="font-medium">
            {row.original.truckPlate || "Chưa gắn xe"}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.original.vehicleId || "—"}
          </span>
        </div>,
        { align: "left", tooltip: row.original.truckPlate ?? undefined }
      ),
    size: 250,
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
        { align: "center" }
      ),
    size: 100,
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
    accessorKey: "lastPingTime",
    header: ({ column }) =>
      createFormattedHeader("Ping cuối", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(<span>{formatDate(row.original.lastPingTime)}</span>, {
        align: "center",
      }),
    size: 190,
  },
  {
    id: "actions",
    header: ({ column }) =>
      createFormattedHeader("Hành động", column, { align: "center" }),
    cell: ({ row }) => <ActionCell device={row.original} />,
    size: 230,
  },
];
