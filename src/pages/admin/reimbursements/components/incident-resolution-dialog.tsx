import { getIncidentErrorMessage } from "@/components/incidents/incident-formatters";
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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  incident: TIncident | null;
  onOpenChange: (open: boolean) => void;
};

const IncidentResolutionDialog = ({ incident, onOpenChange }: Props) => {
  const { resolveIncident } = useIncident();
  const [resolutionNote, setResolutionNote] = useState("");

  useEffect(() => {
    if (incident) setResolutionNote("");
  }, [incident]);

  const handleSubmit = async () => {
    if (!incident) return;
    const note = resolutionNote.trim();
    if (!note) {
      toast.warning("Nhập kết luận xử lý sự cố.");
      return;
    }

    try {
      await resolveIncident.mutateAsync({
        incidentId: incident.incidentId,
        data: { resolutionNote: note },
      });
      toast.success("Đã đóng sự cố và tạo biên bản xử lý.");
      onOpenChange(false);
    } catch (error: unknown) {
      toast.error(getIncidentErrorMessage(error, "Không thể đóng sự cố."));
    }
  };

  return (
    <Dialog open={Boolean(incident)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Đóng sự cố</DialogTitle>
          <DialogDescription>
            Hệ thống sẽ tạo biên bản PDF và gửi thông báo cho người báo sự cố.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="incident-resolution-note">Kết luận xử lý</Label>
          <Textarea
            id="incident-resolution-note"
            rows={5}
            value={resolutionNote}
            placeholder="Tóm tắt nguyên nhân, cách xử lý và kết quả cuối cùng..."
            onChange={(event) => setResolutionNote(event.target.value)}
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
            disabled={resolveIncident.isPending || !resolutionNote.trim()}
            onClick={handleSubmit}
          >
            {resolveIncident.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Xác nhận đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentResolutionDialog;
