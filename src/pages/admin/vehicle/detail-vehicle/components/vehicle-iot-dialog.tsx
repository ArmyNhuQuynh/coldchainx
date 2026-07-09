import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIot } from "@/hooks/use-iot";
import type { TVehicle } from "@/schemas/vehicle.schema";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  vehicle: TVehicle;
  isOpen: boolean;
  onClose: () => void;
};

export function AssignIotDialog({ vehicle, isOpen, onClose }: Props) {
  const { getIotDevices, assignIotDevice } = useIot();
  const { data: devicesData, isLoading } = getIotDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const availableDevices = devicesData?.data?.filter((d) => d.status === "ACTIVE" && !d.vehicleId) || [];

  const handleAssign = () => {
    if (!selectedDeviceId) return;
    assignIotDevice.mutate(
      { vehicleId: vehicle.vehicleId, deviceId: selectedDeviceId },
      {
        onSuccess: (res) => {
          if (res.success) {
            onClose();
          }
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gán thiết bị IoT</DialogTitle>
          <DialogDescription>
            Chọn một thiết bị IoT đang rảnh để gán cho xe {vehicle.truckPlate}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Đang tải danh sách thiết bị...</div>
          ) : availableDevices.length === 0 ? (
            <div className="text-sm text-destructive">Không có thiết bị IoT nào đang rảnh.</div>
          ) : (
            <Select value={selectedDeviceId} onValueChange={setSelectedDeviceId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn thiết bị IoT" />
              </SelectTrigger>
              <SelectContent>
                {availableDevices.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.deviceCode} (Pin: {device.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={assignIotDevice.isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedDeviceId || assignIotDevice.isPending}
          >
            {assignIotDevice.isPending ? "Đang xử lý..." : "Gán thiết bị"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
