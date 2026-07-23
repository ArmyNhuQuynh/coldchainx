import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIncident } from "@/hooks/use-incident";
import type { TIncident } from "@/schemas/incident.schema";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatIncidentMoney, getIncidentErrorMessage } from "@/components/incidents/incident-formatters";

type Props = {
  incident: TIncident | null;
  onOpenChange: (open: boolean) => void;
};

const ExpenseReviewDialog = ({ incident, onOpenChange }: Props) => {
  const { approveExpense } = useIncident();
  const [approvedAmount, setApprovedAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (incident) {
      setApprovedAmount(String(incident.driverPaidAmount));
      setNote("");
    }
  }, [incident]);

  const handleSubmit = async () => {
    if (!incident) return;

    try {
      const amount = Number(approvedAmount);
      if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        amount > incident.driverPaidAmount
      ) {
        toast.warning("Số tiền duyệt phải lớn hơn 0 và không vượt số tiền tài xế đã chi.");
        return;
      }
      if (amount !== incident.driverPaidAmount && !note.trim()) {
        toast.warning("Nhập ghi chú khi số tiền duyệt khác số tiền đề nghị.");
        return;
      }
      await approveExpense.mutateAsync({
        incidentId: incident.incidentId,
        data: {
          approvedAmount: amount,
          approvalNote: note.trim() || undefined,
        },
      });
      toast.success("Đã duyệt chi phí sự cố.");
      onOpenChange(false);
    } catch (error: unknown) {
      toast.error(getIncidentErrorMessage(error, "Không thể duyệt chi phí sự cố."));
    }
  };

  return (
    <Dialog open={Boolean(incident)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Duyệt chi phí tài xế</DialogTitle>
          <DialogDescription>
            Đề nghị hoàn {formatIncidentMoney(incident?.driverPaidAmount)} cho chi phí phát sinh tại hiện trường.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="approved-amount">Số tiền được duyệt</Label>
            <Input id="approved-amount" type="number" min={1} max={incident?.driverPaidAmount} value={approvedAmount} onChange={(event) => setApprovedAmount(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense-review-note">Ghi chú duyệt</Label>
            <Textarea id="expense-review-note" rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" disabled={approveExpense.isPending} onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button type="button" disabled={approveExpense.isPending} onClick={handleSubmit}>
            {approveExpense.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Xác nhận duyệt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseReviewDialog;
