import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TIotDevice } from "@/schemas/iot-device.schema";
import {
  getIotDeviceStatusLabel,
  IOT_DEVICE_STATUS,
  normalizeIotDeviceStatus,
} from "@/types/enums/iot-device-status.enum";
import { Activity, Battery, RadioTower, Truck, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  device: TIotDevice;
};

type StatusRowData = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
};

const StatusRow = ({ icon: Icon, label, value }: StatusRowData) => (
  <div className="flex items-center justify-between gap-4 border-b py-3 last:border-0">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <div className="text-right text-sm font-medium">{value}</div>
  </div>
);

const isOnlineStatus = (device: TIotDevice) =>
  device.isOnline === true ||
  normalizeIotDeviceStatus(device.status) === IOT_DEVICE_STATUS.ONLINE;

const IotDeviceStatusCard = ({ device }: Props) => {
  const status = getIotDeviceStatusLabel(device.status);
  const online = isOnlineStatus(device);
  const rows: StatusRowData[] = [
    {
      icon: Activity,
      label: "Trạng thái",
      value: <Badge className={status.className}>{status.label}</Badge>,
    },
    {
      icon: RadioTower,
      label: "Kết nối",
      value: (
        <Badge
          className={
            online
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-100 text-slate-700"
          }
        >
          {online ? "Online" : "Chưa online"}
        </Badge>
      ),
    },
    {
      icon: Truck,
      label: "Gắn xe",
      value: device.vehicleId ? "Đã gắn" : "Chưa gắn",
    },
    {
      icon: Battery,
      label: "Mức pin",
      value:
        device.batteryLevel === null || device.batteryLevel === undefined
          ? "—"
          : `${device.batteryLevel}%`,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2 text-lg font-semibold">
        Vận hành
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

export default IotDeviceStatusCard;
