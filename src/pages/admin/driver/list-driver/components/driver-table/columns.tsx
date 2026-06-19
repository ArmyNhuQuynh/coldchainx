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
import type { TDriver, TDriverLicense } from "@/schemas/driver.schema";
import { getDriverStatusLabel } from "@/types/enums/driver-status.enum";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const formatDate = (value: string | null | undefined) => {
  if (!hasValue(value)) {
    return "—";
  }

  const date = new Date(value!);

  if (Number.isNaN(date.getTime())) {
    return value!;
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getPrimaryLicense = (driver: TDriver): TDriverLicense | null =>
  driver.licenses[0] ?? null;

const getDriverStatusBadge = (status: string | number | null | undefined) => {
  const statusLabel = getDriverStatusLabel(status);

  return (
    <Badge className={statusLabel.className}>
      {status == null || status === "" ? "—" : statusLabel.label}
    </Badge>
  );
};

const ActionCell = ({ driver }: { driver: TDriver }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="h-9 px-3 rounded-xl"
              onClick={() => navigate(driver.driverId)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Chi tiết
            </Button>
          </TooltipTrigger>
          <TooltipContent>Xem chi tiết tài xế</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export const columns: ColumnDef<TDriver>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) =>
      createFormattedHeader("Tài xế", column, { align: "left" }),
    cell: ({ row }) => {
      const driver = row.original;
      const displayName = driver.fullName || "—";

      return createFormattedCell(
        <div className="flex flex-col">
          <span className="font-semibold text-primary">{displayName}</span>
          <span className="text-xs text-muted-foreground">
            {driver.email || "—"}
          </span>
        </div>,
        { align: "left", tooltip: displayName }
      );
    },
    size: 220,
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) =>
      createFormattedHeader("Liên hệ", column, { align: "left" }),
    cell: ({ row }) => {
      const driver = row.original;
      return createFormattedCell(
        <div className="flex flex-col">
          <span>{driver.phoneNumber}</span>
          <span className="text-xs text-muted-foreground">
            {driver.identityNumber}
          </span>
        </div>,
        { align: "left", tooltip: driver.phoneNumber }
      );
    },
    size: 180,
  },
  {
    accessorKey: "dateOfBirth",
    header: ({ column }) =>
      createFormattedHeader("Ngày sinh", column, { align: "center" }),
    cell: ({ row }) =>
      createFormattedCell(
        <span>{formatDate(row.getValue("dateOfBirth"))}</span>,
        { align: "center" }
      ),
    size: 140,
  },
  {
    id: "license",
    header: ({ column }) =>
      createFormattedHeader("Giấy phép", column, { align: "left" }),
    cell: ({ row }) => {
      const license = getPrimaryLicense(row.original);

      return createFormattedCell(
        <div className="flex flex-col">
          <span className="font-semibold">{license?.licenseNumber || "—"}</span>
          <span className="text-xs text-muted-foreground">
            {license?.licenseClass ? `Hạng ${license.licenseClass}` : "—"}
          </span>
        </div>,
        { align: "left", tooltip: license?.licenseNumber ?? undefined }
      );
    },
    size: 180,
  },
  {
    id: "licenseExpiry",
    header: ({ column }) =>
      createFormattedHeader("Hết hạn GPLX", column, { align: "center" }),
    cell: ({ row }) => {
      const license = getPrimaryLicense(row.original);

      return createFormattedCell(
        <span>{formatDate(license?.expiryDate)}</span>,
        { align: "center" }
      );
    },
    size: 150,
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      createFormattedHeader("Trạng thái", column, { align: "center" }),
    cell: ({ row }) => {
      const status = row.getValue("status") as string | null;

      return createFormattedCell(getDriverStatusBadge(status), {
        align: "center",
      });
    },
    size: 160,
  },
  {
    id: "actions",
    header: ({ column }) =>
      createFormattedHeader("Hành động", column, { align: "center" }),
    cell: ({ row }) => <ActionCell driver={row.original} />,
    size: 160,
  },
];
