import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TDriver } from "@/schemas/driver.schema";
import { getDriverStatusLabel } from "@/types/enums/driver-status.enum";
import { Activity, Hash, IdCard, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  driver: TDriver;
};

type StatusRowData = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
};

const hasValue = (value: unknown) =>
  value !== null && value !== undefined && String(value).trim() !== "";

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

const DriverStatusCard = ({ driver }: Props) => {
  const status = hasValue(driver.status)
    ? getDriverStatusLabel(driver.status)
    : null;

  const rows = compactRows([
    status
      ? {
          icon: Activity,
          label: "Hiện tại",
          value: <Badge className={status.className}>{status.label}</Badge>,
        }
      : null,
    hasValue(driver.driverId)
      ? {
          icon: Hash,
          label: "Mã tài xế",
          value: driver.driverId,
        }
      : null,
    {
      icon: IdCard,
      label: "Số giấy phép",
      value: driver.licenses.length,
    },
  ]);

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

export default DriverStatusCard;
