import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TIotDevice } from "@/schemas/iot-device.schema";
import {
  getIotDeviceAssignmentLabel,
  getIotDeviceDisplayStatus,
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

const getConnectionStatus = (device: TIotDevice) => {
  if (device.isOnline === true) return "ONLINE";
  if (device.isOnline === false) return "OFFLINE";

  const normalizedStatus = normalizeIotDeviceStatus(device.status);
  if (normalizedStatus === IOT_DEVICE_STATUS.ONLINE) return "ONLINE";
  if (normalizedStatus === IOT_DEVICE_STATUS.OFFLINE) return "OFFLINE";

  return "UNKNOWN";
};

const IotDeviceStatusCard = ({ device }: Props) => {
  const status = getIotDeviceStatusLabel(getIotDeviceDisplayStatus(device));
  const assignment = getIotDeviceAssignmentLabel(device.vehicleId);
  const connection = getConnectionStatus(device);
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
            connection === "ONLINE"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : connection === "OFFLINE"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-slate-200 bg-slate-100 text-slate-700"
          }
        >
          {connection === "ONLINE"
            ? "Online"
            : connection === "OFFLINE"
              ? "Mất kết nối"
              : "Chưa có dữ liệu"}
        </Badge>
      ),
    },
    {
      icon: Truck,
      label: "Gắn xe",
      value: (
        <Badge className={assignment.className}>{assignment.label}</Badge>
      ),
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
