import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TIotDevice } from "@/schemas/iot-device.schema";
import {
  Battery,
  CalendarClock,
  Cpu,
  Hash,
  Link2,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  device: TIotDevice;
};

type InfoRowData = {
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

const InfoRow = ({ icon: Icon, label, value }: InfoRowData) => (
  <div className="flex items-center justify-between gap-4 border-b py-3 last:border-0">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <div className="text-right text-sm font-medium">{value}</div>
  </div>
);

const InfoSection = ({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: LucideIcon;
  rows: InfoRowData[];
}) => (
  <div>
    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
      <Icon className="h-4 w-4" />
      {title}
    </p>
    <div>
      {rows.map((row) => (
        <InfoRow key={row.label} {...row} />
      ))}
    </div>
  </div>
);

const IotDeviceDetailInfo = ({ device }: Props) => {
  const identityRows: InfoRowData[] = [
    {
      icon: Hash,
      label: "Device ID",
      value: device.deviceId,
    },
    {
      icon: Cpu,
      label: "Device Code",
      value: device.deviceCode || "—",
    },
    {
      icon: Battery,
      label: "Pin",
      value:
        device.batteryLevel === null || device.batteryLevel === undefined
          ? "—"
          : `${device.batteryLevel}%`,
    },
  ];

  const assignmentRows: InfoRowData[] = [
    {
      icon: Truck,
      label: "Xe đang gắn",
      value: device.vehicleId
        ? device.truckPlate || device.vehicleId
        : "Chưa gắn xe",
    },
    {
      icon: Link2,
      label: "Vehicle ID",
      value: device.vehicleId || "—",
    },
  ];

  const timeRows: InfoRowData[] = [
    {
      icon: CalendarClock,
      label: "Lần ping cuối",
      value: formatDate(device.lastPingTime),
    },
    {
      icon: CalendarClock,
      label: "Ngày tạo",
      value: formatDate(device.createdAt),
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2 text-lg font-semibold">
        Thông tin thiết bị
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-3">
          <InfoSection title="Nhận diện" icon={Cpu} rows={identityRows} />
          <InfoSection title="Gắn xe" icon={Truck} rows={assignmentRows} />
          <InfoSection title="Thời gian" icon={CalendarClock} rows={timeRows} />
        </div>
      </CardContent>
    </Card>
  );
};

export default IotDeviceDetailInfo;
