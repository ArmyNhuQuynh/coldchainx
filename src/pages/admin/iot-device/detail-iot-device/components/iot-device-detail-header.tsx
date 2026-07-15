import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIotDevice } from "@/hooks/use-iot-device";
import { handleApiError } from "@/lib/error";
import { PATH_ADMIN_DASHBOARD } from "@/routes/path";
import type { TIotDevice } from "@/schemas/iot-device.schema";
import { getIotDeviceStatusLabel } from "@/types/enums/iot-device-status.enum";
import { ArrowLeft, Pencil, Trash2, Unlink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Props = {
  device: TIotDevice;
};

const IotDeviceDetailHeader = ({ device }: Props) => {
  const navigate = useNavigate();
  const { deleteIotDevice, updateIotDevice } = useIotDevice();
  const status = getIotDeviceStatusLabel(device.status);

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

  const handleRemoveVehicle = async () => {
    const confirmed = window.confirm(
      `Gỡ thiết bị ${device.deviceCode || device.deviceId} khỏi xe ${
        device.truckPlate || device.vehicleId
      }?`
    );
    if (!confirmed) return;

    try {
      await updateIotDevice.mutateAsync({
        id: device.deviceId,
        data: { removeVehicle: true },
      });
      toast.success("Đã gỡ thiết bị khỏi xe");
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
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
          {device.truckPlate
            ? `Đang gắn với xe ${device.truckPlate}`
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
        {device.vehicleId && (
          <Button
            variant="outline"
            disabled={updateIotDevice.isPending}
            onClick={handleRemoveVehicle}
          >
            <Unlink className="mr-2 h-4 w-4" />
            Gỡ khỏi xe
          </Button>
        )}
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
  );
};

export default IotDeviceDetailHeader;
