import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIotDevice } from "@/hooks/use-iot-device";
import { handleApiError } from "@/lib/error";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import type { TIotDevice } from "@/schemas/iot-device.schema";
import {
  getIotDeviceDisplayStatus,
  getIotDeviceStatusLabel,
} from "@/types/enums/iot-device-status.enum";
import { ArrowLeft, Link2, Pencil, Trash2, Unlink } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import IotDeviceAssignmentDialog from "./iot-device-assignment-dialog";

type Props = {
  device: TIotDevice;
};

const IotDeviceDetailHeader = ({ device }: Props) => {
  const navigate = useNavigate();
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const { deleteIotDevice } = useIotDevice();
  const status = getIotDeviceStatusLabel(getIotDeviceDisplayStatus(device));

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Xóa thiết bị ${device.deviceCode || device.deviceId}?`
    );
    if (!confirmed) return;

    try {
      await deleteIotDevice.mutateAsync(device.deviceId);
      toast.success("Xóa thiết bị IoT thành công");
      navigate(PATH_ADMIN_DASHBOARD.iotDevice.root);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold">Chi tiết thiết bị IoT</h1>
            <span className="text-2xl font-bold text-primary">
              {device.deviceCode || device.deviceId}
            </span>
            <Badge className={status.className}>{status.label}</Badge>
          </div>
          <p className="text-muted-foreground">
            {device.vehicleId
              ? `Đang gắn với xe ${device.truckPlate || device.vehicleId}`
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
            className="text-destructive hover:text-destructive"
            disabled={deleteIotDevice.isPending}
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
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
