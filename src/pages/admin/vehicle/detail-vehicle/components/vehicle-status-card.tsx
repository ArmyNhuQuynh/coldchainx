import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TVehicle } from "@/schemas/vehicle.schema";
import { getVehicleStatusLabel } from "@/types/enums/vehicle-status.enum";
import { Activity, CalendarClock, Hash, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  vehicle: TVehicle;
};

type StatusRowData = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
};

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const compactRows = (rows: Array<StatusRowData | null>) =>
  rows.filter((row): row is StatusRowData => row !== null);

const StatusRow = ({ icon: Icon, label, value }: StatusRowData) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <div className="font-medium text-sm text-right">{value}</div>
  </div>
);

const VehicleStatusCard = ({ vehicle }: Props) => {
  const status = hasValue(vehicle.status)
    ? getVehicleStatusLabel(vehicle.status)
    : null;

  const rows = compactRows([
    status
      ? {
          icon: Activity,
          label: "Hiện tại",
          value: <Badge className={status.className}>{status.label}</Badge>,
        }
      : null,
    hasValue(vehicle.createdAt)
      ? {
          icon: CalendarClock,
          label: "Ngày tạo",
          value: formatDateTime(vehicle.createdAt!),
        }
      : null,
    hasValue(vehicle.vehicleId)
      ? {
          icon: Hash,
          label: "Mã xe",
          value: vehicle.vehicleId,
        }
      : null,
  ]);

  if (rows.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="font-semibold text-lg pb-2">
        Trạng thái
      </CardHeader>
      <CardContent>
        <div>{rows.map((row) => <StatusRow key={row.label} {...row} />)}</div>
      </CardContent>
    </Card>
  );
};

export default VehicleStatusCard;
