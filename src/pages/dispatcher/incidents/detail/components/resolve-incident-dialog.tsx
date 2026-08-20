import {
  formatIncidentId,
  getIncidentErrorMessage,
  getResolveIncidentErrorMessage,
} from "@/components/incidents/incident-formatters";
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
import { incidentQueryKeys, useIncident } from "@/hooks/use-incident";
import type { TIncident } from "@/schemas/incident.schema";
import { INCIDENT_STATUS } from "@/types/enums/incident-status.enum";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getIncidentResolveEligibility } from "../incident-workflow";

type Props = {
  open: boolean;
  incident: TIncident;
  currentRole?: string | null;
  onOpenChange: (open: boolean) => void;
};

const ResolveIncidentDialog = ({
  open,
  incident,
  currentRole,
  onOpenChange,
}: Props) => {
  const queryClient = useQueryClient();
  const { resolveIncident } = useIncident();
  const [resolutionNote, setResolutionNote] = useState("");
  const submittingRef = useRef(false);
  const eligibility = getIncidentResolveEligibility(incident, currentRole);
  const blocker = eligibility.reason;

  useEffect(() => {
    if (!open || incident.status !== INCIDENT_STATUS.RESOLVED) return;
    setResolutionNote("");
    onOpenChange(false);
  }, [incident.status, onOpenChange, open]);

  const handleSubmit = async () => {
    if (blocker || !resolutionNote.trim() || submittingRef.current) return;
    submittingRef.current = true;
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
      const backendMessage = getIncidentErrorMessage(error, "");
      if (backendMessage === "Incident is already resolved.") {
        setResolutionNote("");
        onOpenChange(false);
        void queryClient.invalidateQueries({
          queryKey: incidentQueryKeys.root,
        });
      }
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Đóng Incident?</DialogTitle>
          <DialogDescription>
            Incident SC-{formatIncidentId(incident.incidentId)} · Trip{" "}
            {formatIncidentId(incident.tripId)}
          </DialogDescription>
        </DialogHeader>
        {blocker && (
          <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            {blocker}
          </p>
        )}
        <div className="space-y-2 py-2">
          <Label htmlFor="resolution-note">Ghi chú xử lý *</Label>
          <Textarea
            id="resolution-note"
            rows={4}
            value={resolutionNote}
            onChange={(event) => setResolutionNote(event.target.value)}
            placeholder="Sự cố đã được xử lý và chuyến đã tiếp tục..."
          />
        </div>
        <p className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
          Sau khi đóng, Incident chuyển sang chế độ chỉ xem và backend sẽ tạo
          biên bản PDF.
        </p>
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
            disabled={
              Boolean(blocker) ||
              !resolutionNote.trim() ||
              resolveIncident.isPending
            }
            onClick={handleSubmit}
          >
            {resolveIncident.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            Xác nhận đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResolveIncidentDialog;
