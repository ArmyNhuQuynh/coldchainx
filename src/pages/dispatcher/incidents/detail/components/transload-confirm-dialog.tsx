import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useIncident } from "@/hooks/use-incident";
import type { TIncident } from "@/schemas/incident.schema";
import { Loader2, RadioTower } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [sealNumber, setSealNumber] = useState("");
  const [transferTemperature, setTransferTemperature] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [evidenceText, setEvidenceText] = useState("");
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setConfirmationNote("");
      setSealNumber("");
      setTransferTemperature("");
      setLocationDescription("");
      setLatitude("");
      setLongitude("");
      setEvidenceText("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (submittingRef.current) return;
    const note = confirmationNote.trim();
    if (!note) {
      toast.warning("Nhập ghi chú xác nhận sang hàng.");
      return;
    }
    const parsedLatitude = latitude.trim() === "" ? undefined : Number(latitude);
    const parsedLongitude = longitude.trim() === "" ? undefined : Number(longitude);
    if (
      (parsedLatitude != null && (!Number.isFinite(parsedLatitude) || parsedLatitude < -90 || parsedLatitude > 90)) ||
      (parsedLongitude != null && (!Number.isFinite(parsedLongitude) || parsedLongitude < -180 || parsedLongitude > 180))
    ) {
      toast.warning("Tọa độ sang hàng không hợp lệ.");
      return;
    }
    const evidenceUrls = evidenceText
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
    const invalidEvidence = evidenceUrls.find((value) => {
      try {
        const url = new URL(value);
        return url.protocol !== "http:" && url.protocol !== "https:";
      } catch {
        return true;
      }
    });
    if (invalidEvidence) {
      toast.warning(`Evidence URL không hợp lệ: ${invalidEvidence}`);
      return;
    }

    submittingRef.current = true;
    try {
      const result = await confirmTransload.mutateAsync({
        incidentId: incident.incidentId,
        data: {
          confirmationNote: note,
          lpnIds: incident.externalReeferPlan?.lpnIds ?? [],
          sealNumber: sealNumber.trim() || undefined,
          transferTemperature:
            transferTemperature.trim() === ""
              ? undefined
              : Number(transferTemperature),
          transferredAt: new Date().toISOString(),
          latitude: parsedLatitude,
          longitude: parsedLongitude,
          locationDescription: locationDescription.trim() || undefined,
          evidenceUrls,
        },
      });
      toast.success(
        result.message || `Đã xác nhận sang hàng sang xe ${result.vehiclePlate}.`
      );
      onOpenChange(false);
    } catch (error: unknown) {
      toast.error(getIncidentErrorMessage(error, "Không thể xác nhận sang hàng."));
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Xác nhận sang hàng</DialogTitle>
          <DialogDescription>
            Xác nhận toàn bộ LPN đã sang xe thay thế và cho chuyến tiếp tục. Đây thường là hành động của Driver tại hiện trường; Dispatcher cũng được backend cho phép.
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="transload-seal">Seal xe thay thế</Label>
            <Input id="transload-seal" value={sealNumber} onChange={(event) => setSealNumber(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transload-temperature">Nhiệt độ khi chuyển (°C)</Label>
            <Input id="transload-temperature" type="number" step="0.1" value={transferTemperature} onChange={(event) => setTransferTemperature(event.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="transload-location">Vị trí sang hàng</Label>
            <Input id="transload-location" value={locationDescription} onChange={(event) => setLocationDescription(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transload-latitude">Vĩ độ</Label>
            <Input id="transload-latitude" type="number" min={-90} max={90} step="any" value={latitude} onChange={(event) => setLatitude(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transload-longitude">Kinh độ</Label>
            <Input id="transload-longitude" type="number" min={-180} max={180} step="any" value={longitude} onChange={(event) => setLongitude(event.target.value)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="transload-evidence">Evidence URLs (mỗi dòng một URL)</Label>
            <Textarea id="transload-evidence" rows={3} value={evidenceText} onChange={(event) => setEvidenceText(event.target.value)} />
          </div>
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
