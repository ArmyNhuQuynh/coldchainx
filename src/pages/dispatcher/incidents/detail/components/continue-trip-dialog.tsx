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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIncident } from "@/hooks/use-incident";
import type { TIncident } from "@/schemas/incident.schema";
import { Loader2, Play } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  incident: TIncident;
  onOpenChange: (open: boolean) => void;
};

const ContinueTripDialog = ({ open, incident, onOpenChange }: Props) => {
  const { continueTrip } = useIncident();
  const [handlingNote, setHandlingNote] = useState(incident.handlingNote ?? "");
  const [expectedDelayMinutes, setExpectedDelayMinutes] = useState("20");
  const submittingRef = useRef(false);

  const handleSubmit = async () => {
    const delay = Number(expectedDelayMinutes);
    if (!handlingNote.trim() || !Number.isInteger(delay) || delay < 0 || submittingRef.current) return;

    submittingRef.current = true;
    try {
      await continueTrip.mutateAsync({
        incidentId: incident.incidentId,
        data: { handlingNote: handlingNote.trim(), expectedDelayMinutes: delay },
      });
      toast.success("Backend đã xác nhận cho chuyến tiếp tục.");
      onOpenChange(false);
    } catch (error: unknown) {
      toast.error(
        getIncidentErrorMessage(error, "Không thể cho chuyến tiếp tục.")
      );
    } finally {
      submittingRef.current = false;
    }
  };

  const valid =
    handlingNote.trim().length > 0 &&
    Number.isInteger(Number(expectedDelayMinutes)) &&
    Number(expectedDelayMinutes) >= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Cho chuyến tiếp tục</DialogTitle>
          <DialogDescription>
            Chỉ gửi khi xe và nhiệt độ đã an toàn. Backend sẽ chuyển trip về IN_TRANSIT.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="handling-note">Ghi chú xử lý *</Label>
            <Textarea
              id="handling-note"
              rows={4}
              value={handlingNote}
              onChange={(event) => setHandlingNote(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expected-delay">Trễ dự kiến (phút) *</Label>
            <Input
              id="expected-delay"
              type="number"
              min={0}
              value={expectedDelayMinutes}
              onChange={(event) => setExpectedDelayMinutes(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={continueTrip.isPending}
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            disabled={!valid || continueTrip.isPending}
            onClick={handleSubmit}
          >
            {continueTrip.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Xác nhận tiếp tục
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContinueTripDialog;
