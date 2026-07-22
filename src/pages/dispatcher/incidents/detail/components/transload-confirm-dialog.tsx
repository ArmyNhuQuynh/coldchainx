import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  const [temperature, setTemperature] = useState("");
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    if (!open) {
      setTemperature("");
      setNote("");
      setPhotos([]);
    }
  }, [open]);

  const handleSubmit = async () => {
    const parsedTemperature = temperature.trim() ? Number(temperature) : undefined;
    if (parsedTemperature !== undefined && !Number.isFinite(parsedTemperature)) {
      toast.warning("Nhiệt độ bàn giao không hợp lệ.");
      return;
    }

    try {
      const result = await confirmTransload.mutateAsync({
        incidentId: incident.incidentId,
        data: { handoverTemperature: parsedTemperature, note, photos },
      });
      toast.success(`Đã xác nhận sang ${result.transferredLpnCount} LPN sang xe ${result.truckPlate}.`);
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

        <div className="grid gap-4 py-2 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="transload-temperature">Nhiệt độ bàn giao (°C)</Label>
            <Input id="transload-temperature" type="number" step="0.1" value={temperature} placeholder="VD: -18" onChange={(event) => setTemperature(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transload-photos">Ảnh sang hàng</Label>
            <Input id="transload-photos" type="file" multiple accept="image/*" onChange={(event) => setPhotos(Array.from(event.target.files ?? []))} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="transload-note">Ghi chú hiện trường</Label>
            <Textarea id="transload-note" value={note} rows={4} placeholder="Tình trạng hàng, niêm phong và ghi chú bàn giao..." onChange={(event) => setNote(event.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" disabled={confirmTransload.isPending} onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button type="button" disabled={confirmTransload.isPending} onClick={handleSubmit}>
            {confirmTransload.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Xác nhận sang hàng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransloadConfirmDialog;
