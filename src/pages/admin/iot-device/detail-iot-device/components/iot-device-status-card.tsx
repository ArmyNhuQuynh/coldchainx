import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TIotDevice } from "@/schemas/iot-device.schema";
import {
  getIotDeviceAssignmentLabel,
  getIotDeviceConnectionLabel,
  getIotDeviceDisplayStatus,
  getIotDeviceStatusLabel,
} from "@/types/enums/iot-device-status.enum";
import { Activity, RadioTower, Truck, type LucideIcon } from "lucide-react";
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

const IotDeviceStatusCard = ({ device }: Props) => {
  const status = getIotDeviceStatusLabel(getIotDeviceDisplayStatus(device));
  const assignment = getIotDeviceAssignmentLabel(device.vehicleId);
  const connection = getIotDeviceConnectionLabel(device);
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
        <Badge className={connection.className}>{connection.label}</Badge>
      ),
    },
    {
      icon: Truck,
      label: "Gắn xe",
      value: (
        <Badge className={assignment.className}>{assignment.label}</Badge>
      ),
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
