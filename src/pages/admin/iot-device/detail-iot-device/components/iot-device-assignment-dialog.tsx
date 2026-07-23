import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIotDevice } from "@/hooks/use-iot-device";
import { useVehicle } from "@/hooks/use-vehicle";
import { handleApiError } from "@/lib/error";
import type { TIotDevice } from "@/schemas/iot-device.schema";
import { IOT_DEVICE_STATUS } from "@/types/enums/iot-device-status.enum";
import { Link2, Unlink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {
  device: TIotDevice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const IotDeviceAssignmentDialog = ({
  device,
  open,
  onOpenChange,
}: Props) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const {
    assignIotDevice,
    getIotDevices,
    updateIotDevice,
  } = useIotDevice();
  const { getVehicles } = useVehicle();
  const { data: devices = [], isLoading: isLoadingDevices } = getIotDevices();
  const { data: vehicleResponse, isLoading: isLoadingVehicles } = getVehicles();
  const vehicles = vehicleResponse?.data ?? [];
  const isRemoving = Boolean(device.vehicleId);
  const isSubmitting =
    assignIotDevice.isPending || updateIotDevice.isPending;

  const availableVehicles = useMemo(() => {
    const assignedVehicleIds = new Set(
      devices
        .filter(
          (assignedDevice) =>
            assignedDevice.deviceId !== device.deviceId &&
            Boolean(assignedDevice.vehicleId)
        )
        .map((assignedDevice) => assignedDevice.vehicleId)
    );

    return vehicles.filter(
      (vehicle) => !assignedVehicleIds.has(vehicle.vehicleId)
    );
  }, [device.deviceId, devices, vehicles]);

  useEffect(() => {
    if (!open) {
      setSelectedVehicleId("");
    }
  }, [open]);

  const handleAssign = async () => {
    if (!device.deviceCode || !selectedVehicleId) return;

    try {
      await assignIotDevice.mutateAsync({
        deviceId: device.deviceId,
        data: {
          deviceCode: device.deviceCode,
          vehicleId: selectedVehicleId,
        },
      });
      toast.success("Đã gắn thiết bị IoT vào xe");
      onOpenChange(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRemove = async () => {
    try {
      await updateIotDevice.mutateAsync({
        id: device.deviceId,
        data: {
          removeVehicle: true,
          status: IOT_DEVICE_STATUS.AVAILABLE,
        },
      });
      toast.success("Đã gỡ thiết bị khỏi xe");
      onOpenChange(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isRemoving ? "Gỡ thiết bị khỏi xe" : "Gắn thiết bị vào xe"}
          </DialogTitle>
          <DialogDescription>
            {isRemoving
              ? `${device.deviceCode ? `Thiết bị ${device.deviceCode}` : "Thiết bị này"} đang gắn với xe ${
                  device.truckPlate || "chưa có biển số"
                }.`
              : "Chỉ những xe chưa được gắn với thiết bị IoT khác mới xuất hiện trong danh sách."}
          </DialogDescription>
        </DialogHeader>

        {isRemoving ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Sau khi gỡ, thiết bị sẽ chuyển về trạng thái khả dụng và có thể
            được gắn cho xe khác.
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="iot-vehicle">
              Xe
            </label>
            <Select
              value={selectedVehicleId}
              onValueChange={setSelectedVehicleId}
              disabled={isLoadingDevices || isLoadingVehicles || isSubmitting}
            >
              <SelectTrigger id="iot-vehicle" className="h-11 w-full">
                <SelectValue
                  placeholder={
                    isLoadingDevices || isLoadingVehicles
                      ? "Đang tải danh sách xe..."
                      : "Chọn xe chưa gắn thiết bị"
                  }
                />
              </SelectTrigger>
              <SelectContent className="min-h-0">
                {availableVehicles.map((vehicle) => (
                  <SelectItem
                    key={vehicle.vehicleId}
                    value={vehicle.vehicleId}
                  >
                    {vehicle.truckPlate || "Xe chưa có biển số"}
                    {vehicle.brand ? ` - ${vehicle.brand}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isLoadingDevices &&
              !isLoadingVehicles &&
              availableVehicles.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Không còn xe nào chưa gắn thiết bị IoT.
                </p>
              )}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant={isRemoving ? "destructive" : "default"}
            disabled={
              isSubmitting ||
              (!isRemoving &&
                (!selectedVehicleId ||
                  !device.deviceCode ||
                  availableVehicles.length === 0))
            }
            onClick={isRemoving ? handleRemove : handleAssign}
          >
            {isRemoving ? (
              <Unlink className="mr-2 h-4 w-4" />
            ) : (
              <Link2 className="mr-2 h-4 w-4" />
            )}
            {isSubmitting
              ? "Đang xử lý..."
              : isRemoving
                ? "Xác nhận gỡ"
                : "Gắn vào xe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IotDeviceAssignmentDialog;
