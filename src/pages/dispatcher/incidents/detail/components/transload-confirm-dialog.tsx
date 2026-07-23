import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIncident } from "@/hooks/use-incident";
import type { TIncident } from "@/schemas/incident.schema";
import { Loader2, RadioTower } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getIncidentErrorMessage } from "@/components/incidents/incident-formatters";

type Props = {
  open: boolean;
  incident: TIncident;
  onOpenChange: (open: boolean) => void;
};

const TransloadConfirmDialog = ({ open, incident, onOpenChange }: Props) => {
  const { confirmTransload } = useIncident();
  const [confirmationNote, setConfirmationNote] = useState("");

  useEffect(() => {
    if (!open) {
      setConfirmationNote("");
    }
  }, [open]);

  const handleSubmit = async () => {
    const note = confirmationNote.trim();
    if (!note) {
      toast.warning("Nhập ghi chú xác nhận sang hàng.");
      return;
    }

    try {
      const result = await confirmTransload.mutateAsync({
        incidentId: incident.incidentId,
        data: { confirmationNote: note },
      });
      toast.success(
        result.message || `Đã xác nhận sang hàng sang xe ${result.vehiclePlate}.`
      );
      onOpenChange(false);
    } catch (error: unknown) {
      toast.error(getIncidentErrorMessage(error, "Không thể xác nhận sang hàng."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Xác nhận sang hàng</DialogTitle>
          <DialogDescription>
            Xác nhận toàn bộ LPN đã sang xe thay thế và cho chuyến tiếp tục hành trình.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 rounded-lg border border-amber-300 p-3 text-sm text-amber-800">
          <RadioTower className="mt-0.5 h-4 w-4 shrink-0" />
          Thiết bị IoT của xe thay thế phải online. BE sẽ gửi lệnh START_STREAMING ngay sau khi xác nhận.
        </div>

        <div className="space-y-2 py-2">
          <Label htmlFor="transload-confirmation-note">Ghi chú xác nhận</Label>
          <Textarea
            id="transload-confirmation-note"
            value={confirmationNote}
            rows={4}
            placeholder="Xác nhận toàn bộ hàng đã sang xe thay thế và sẵn sàng tiếp tục chuyến..."
            onChange={(event) => setConfirmationNote(event.target.value)}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" disabled={confirmTransload.isPending} onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button type="button" disabled={confirmTransload.isPending || !confirmationNote.trim()} onClick={handleSubmit}>
            {confirmTransload.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Xác nhận sang hàng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransloadConfirmDialog;
