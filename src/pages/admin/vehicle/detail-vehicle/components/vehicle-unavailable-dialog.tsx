import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useVehicle } from "@/hooks/use-vehicle";
import { handleApiError } from "@/lib/error";
import type { TVehicle } from "@/schemas/vehicle.schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: TVehicle;
};

const VehicleUnavailableDialog = ({ open, onOpenChange, vehicle }: Props) => {
  const { markVehicleUnavailable } = useVehicle();
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  const handleSubmit = async () => {
    if (markVehicleUnavailable.isPending) return;

    try {
      await markVehicleUnavailable.mutateAsync({
        vehicleId: vehicle.vehicleId,
        reason: reason.trim() || undefined,
      });
      toast.success("Đã đánh dấu xe không khả dụng");
      onOpenChange(false);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!markVehicleUnavailable.isPending) onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Đánh dấu xe không khả dụng</DialogTitle>
          <DialogDescription>
            Xe {vehicle.truckPlate} sẽ được chuyển sang trạng thái ngừng hoạt động và không dùng để điều phối.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Lý do</Label>
          <Textarea
            className="min-h-28 rounded-xl bg-background"
            placeholder="Ví dụ: xe hỏng lạnh, chờ kiểm tra, tạm ngưng khai thác..."
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={markVehicleUnavailable.isPending}
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-xl"
            disabled={markVehicleUnavailable.isPending}
            onClick={handleSubmit}
          >
            {markVehicleUnavailable.isPending ? "Đang khóa..." : "Khóa xe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleUnavailableDialog;
