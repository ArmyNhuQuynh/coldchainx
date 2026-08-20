import { getResolveIncidentErrorMessage } from "@/components/incidents/incident-formatters";
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
import { useIncident } from "@/hooks/use-incident";
import type { TIncident } from "@/schemas/incident.schema";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getResolutionBlocker } from "../incident-workflow";

type Props = {
  open: boolean;
  incident: TIncident;
  onOpenChange: (open: boolean) => void;
};

const ResolveIncidentDialog = ({ open, incident, onOpenChange }: Props) => {
  const { resolveIncident } = useIncident();
  const [resolutionNote, setResolutionNote] = useState("");
  const blocker = getResolutionBlocker(incident);

  const handleSubmit = async () => {
    if (blocker || !resolutionNote.trim()) return;
    try {
      const resolved = await resolveIncident.mutateAsync({
        incidentId: incident.incidentId,
        data: { resolutionNote: resolutionNote.trim() },
      });
      if (!resolved) {
        toast.error("Backend chưa xác nhận Incident đã được đóng.");
        return;
      }
      toast.success("Đã đóng Incident thành công.");
      setResolutionNote("");
      onOpenChange(false);
    } catch (error: unknown) {
      toast.error(getResolveIncidentErrorMessage(error));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Đóng Incident</DialogTitle>
          <DialogDescription>
            Backend kiểm tra lại trạng thái vận hành và hoàn ứng trước khi đóng.
          </DialogDescription>
        </DialogHeader>
        {blocker && (
          <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            {blocker}
          </p>
        )}
        <div className="space-y-2 py-2">
          <Label htmlFor="resolution-note">Ghi chú kết thúc *</Label>
          <Textarea
            id="resolution-note"
            rows={4}
            value={resolutionNote}
            onChange={(event) => setResolutionNote(event.target.value)}
            placeholder="Hàng đã được nhập lại kho, tạo chuyến mới và tiếp tục giao cho khách..."
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={resolveIncident.isPending}
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            disabled={Boolean(blocker) || !resolutionNote.trim() || resolveIncident.isPending}
            onClick={handleSubmit}
          >
            {resolveIncident.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Đóng Incident
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResolveIncidentDialog;
