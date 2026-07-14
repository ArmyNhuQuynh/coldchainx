import {
  createFormattedCell,
  createFormattedHeader,
} from "@/components/table/table-formatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TRouteSchedule } from "@/schemas/route-schedule.schema";
import { getRouteScheduleStatusLabel } from "@/types/enums/route-schedule-status.enum";
import type { ColumnDef } from "@tanstack/react-table";
import type { MouseEvent } from "react";
import {
  formatScheduleDate,
  formatScheduleTime,
} from "../route-schedule-utils";

export type TRouteScheduleTableRow = TRouteSchedule & {
  id: string;
};

type ColumnHandlers = {
  isDeleting?: boolean;
  onEdit: (schedule: TRouteSchedule) => void;
  onDelete: (schedule: TRouteSchedule) => void;
};

const formatCreatedAt = (value?: string | null) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("vi-VN");
};

const StatusBadge = ({ status }: { status?: string | null }) => {
  const statusLabel = getRouteScheduleStatusLabel(status);

  return (
    <Badge variant="outline" className={statusLabel.className}>
      {statusLabel.label}
    </Badge>
  );
};

const ActionCell = ({
  schedule,
  isDeleting,
  onEdit,
  onDelete,
}: ColumnHandlers & { schedule: TRouteSchedule }) => {
  const handleEdit = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onEdit(schedule);
  };

  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete(schedule);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-9 rounded-xl px-4"
        onClick={handleEdit}
      >
        Sửa
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="h-9 rounded-xl px-4 text-destructive hover:text-destructive"
        disabled={isDeleting}
        onClick={handleDelete}
      >
        Xóa
      </Button>
    </div>
  );
};

export const getRouteScheduleColumns = ({
  isDeleting,
  onEdit,
  onDelete,
}: ColumnHandlers): ColumnDef<TRouteScheduleTableRow>[] => [
  {
    accessorKey: "scheduleName",
    header: ({ column }) =>
      createFormattedHeader("Tên lịch", column, { align: "left" }),
    cell: ({ row }) => {
      const scheduleName = row.original.scheduleName || "—";

      return createFormattedCell(
        <span className="truncate font-semibold text-primary">
          {scheduleName}
        </span>,
        {
          align: "left",
          maxWidth: "240px",
          tooltip: scheduleName,
          truncate: true,
        }
      );
    },
    size: 260,
  },
  {
    accessorKey: "departureDate",
    header: ({ column }) =>
      createFormattedHeader("Ngày đi", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(
        <span>{formatScheduleDate(row.original.departureDate)}</span>,
        { align: "center" }
      ),
    size: 130,
  },
  {
    accessorKey: "departureTime",
    header: ({ column }) =>
      createFormattedHeader("Giờ xuất phát", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(
        <span className="font-medium">
          {formatScheduleTime(row.original.departureTime)}
        </span>,
        { align: "center" }
      ),
    size: 150,
  },
  {
    accessorKey: "cutOffTime",
    header: ({ column }) =>
      createFormattedHeader("Cut-off", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(
        <span className="font-medium">
          {formatScheduleTime(row.original.cutOffTime)}
        </span>,
        { align: "center" }
      ),
    size: 130,
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      createFormattedHeader("Trạng thái", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(<StatusBadge status={row.original.status} />, {
        align: "center",
      }),
    size: 160,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) =>
      createFormattedHeader("Ngày tạo", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(
        <span>{formatCreatedAt(row.original.createdAt)}</span>,
        { align: "center" }
      ),
    size: 130,
  },
  {
    id: "actions",
    header: ({ column }) =>
      createFormattedHeader("Hành động", column, { align: "center" }),
    cell: ({ row }) => (
      <ActionCell
        schedule={row.original}
        isDeleting={isDeleting}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
    size: 190,
  },
];
