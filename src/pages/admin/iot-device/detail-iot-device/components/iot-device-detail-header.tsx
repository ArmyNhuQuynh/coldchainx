import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import type { TIotDevice } from "@/schemas/iot-device.schema";
import {
  getIotDeviceDisplayStatus,
  getIotDeviceStatusLabel,
} from "@/types/enums/iot-device-status.enum";
import { ArrowLeft, Link2, Pencil, Unlink } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IotDeviceAssignmentDialog from "./iot-device-assignment-dialog";

type Props = {
  device: TIotDevice;
};

const IotDeviceDetailHeader = ({ device }: Props) => {
  const navigate = useNavigate();
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const status = getIotDeviceStatusLabel(getIotDeviceDisplayStatus(device));

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold">Chi tiết thiết bị IoT</h1>
            <span className="text-2xl font-bold text-primary">
              {device.deviceCode || "Chưa có mã thiết bị"}
            </span>
            <Badge className={status.className}>{status.label}</Badge>
          </div>
          <p className="text-muted-foreground">
            {device.vehicleId
              ? `Đang gắn với xe ${device.truckPlate || "chưa có biển số"}`
              : "Thiết bị chưa gắn với xe nào"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(PATH_ADMIN_DASHBOARD.iotDevice.root)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsAssignmentDialogOpen(true)}
          >
            {device.vehicleId ? (
              <Unlink className="mr-2 h-4 w-4" />
            ) : (
              <Link2 className="mr-2 h-4 w-4" />
            )}
            {device.vehicleId ? "Gỡ khỏi xe" : "Gắn vào xe"}
          </Button>
          <Button
            onClick={() =>
              navigate(PATH_ADMIN_DASHBOARD.iotDevice.edit(device.deviceId))
            }
          >
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <IotDeviceAssignmentDialog
        device={device}
        open={isAssignmentDialogOpen}
        onOpenChange={setIsAssignmentDialogOpen}
      />
    </>
  );
};

export default IotDeviceDetailHeader;
