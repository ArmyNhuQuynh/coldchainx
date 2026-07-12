import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TWarehouse } from "@/schemas/warehouse.schema";
import { getWarehouseStatusLabel } from "@/types/enums/warehouse-status.enum";
import { Activity, CalendarClock, Gauge, Hash, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  warehouse: TWarehouse;
};

type StatusRowData = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
};

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim() !== "";

const formatDate = (value?: string | null) => {
  if (!hasValue(value)) return "—";

  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("vi-VN");
};

const getCapacityPercent = (current?: number | null, max?: number | null) => {
  if (!max || max <= 0) return 0;

  return Math.min(100, Math.round(((current ?? 0) / max) * 100));
};

const StatusRow = ({ icon: Icon, label, value }: StatusRowData) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <div className="font-medium text-sm text-right">{value}</div>
  </div>
);

const WarehouseStatusCard = ({ warehouse }: Props) => {
  const status = getWarehouseStatusLabel(warehouse.status);
  const capacityPercent = getCapacityPercent(
    warehouse.currentPallets,
    warehouse.maxPallets
  );
  const rows: StatusRowData[] = [
    {
      icon: Activity,
      label: "Hiện tại",
      value: <Badge className={status.className}>{status.label}</Badge>,
    },
    {
      icon: Hash,
      label: "ID kho",
      value: warehouse.warehouseId,
    },
    {
      icon: Gauge,
      label: "Mức sử dụng",
      value: `${capacityPercent}%`,
    },
    {
      icon: CalendarClock,
      label: "Ngày tạo",
      value: formatDate(warehouse.createdAt),
    },
    {
      icon: CalendarClock,
      label: "Cập nhật",
      value: formatDate(warehouse.updatedAt),
    },
  ];

  return (
    <Card>
      <CardHeader className="font-semibold text-lg pb-2">
        Trạng thái
      </CardHeader>
      <CardContent>
        <div>
          {rows.map((row) => (
            <StatusRow key={row.label} {...row} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WarehouseStatusCard;
