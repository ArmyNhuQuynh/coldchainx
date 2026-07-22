import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIncident } from "@/hooks/use-incident";
import { cn } from "@/lib/utils";
import type { TIncident } from "@/schemas/incident.schema";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatIncidentMoney, getIncidentErrorMessage } from "@/components/incidents/incident-formatters";

type Props = {
  incident: TIncident | null;
  onOpenChange: (open: boolean) => void;
};

const ExpenseReviewDialog = ({ incident, onOpenChange }: Props) => {
  const { reviewExpense } = useIncident();
  const [action, setAction] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [approvedAmount, setApprovedAmount] = useState("");
  const [note, setNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (incident) {
      setAction("APPROVE");
      setApprovedAmount(String(incident.driverPaidAmount));
      setNote("");
      setRejectionReason("");
    }
  }, [incident]);

  const handleSubmit = async () => {
    if (!incident) return;

    try {
      if (action === "APPROVE") {
        const amount = Number(approvedAmount);
        if (!Number.isFinite(amount) || amount < 0 || amount > incident.driverPaidAmount) {
          toast.warning("Số tiền duyệt phải từ 0 đến số tiền tài xế đã chi.");
          return;
        }
        if (amount !== incident.driverPaidAmount && !note.trim()) {
          toast.warning("Nhập ghi chú khi số tiền duyệt khác số tiền đề nghị.");
          return;
        }
        await reviewExpense.mutateAsync({
          incidentId: incident.incidentId,
          data: { action: 1, approvedAmount: amount, note: note.trim() || undefined },
        });
        toast.success("Đã duyệt chi phí sự cố.");
      } else {
        if (!rejectionReason.trim()) {
          toast.warning("Nhập lý do từ chối chi phí.");
          return;
        }
        await reviewExpense.mutateAsync({
          incidentId: incident.incidentId,
          data: { action: 2, rejectionReason: rejectionReason.trim(), note: note.trim() || undefined },
        });
        toast.success("Đã từ chối đề nghị hoàn chi phí.");
      }
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

        <div className="grid grid-cols-2 rounded-lg border p-1">
          <Button type="button" variant="ghost" className={cn("rounded-md", action === "APPROVE" && "border border-emerald-500 text-emerald-700")} onClick={() => setAction("APPROVE")}>
            <CheckCircle2 className="h-4 w-4" /> Duyệt
          </Button>
          <Button type="button" variant="ghost" className={cn("rounded-md", action === "REJECT" && "border border-rose-500 text-rose-700")} onClick={() => setAction("REJECT")}>
            <XCircle className="h-4 w-4" /> Từ chối
          </Button>
        </div>

        <div className="space-y-4 py-2">
          {action === "APPROVE" ? (
            <div className="space-y-2">
              <Label htmlFor="approved-amount">Số tiền được duyệt</Label>
              <Input id="approved-amount" type="number" min={0} max={incident?.driverPaidAmount} value={approvedAmount} onChange={(event) => setApprovedAmount(event.target.value)} />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Lý do từ chối</Label>
              <Textarea id="rejection-reason" rows={3} value={rejectionReason} placeholder="Hóa đơn không hợp lệ, khoản chi không thuộc phạm vi..." onChange={(event) => setRejectionReason(event.target.value)} />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="expense-review-note">Ghi chú nội bộ</Label>
            <Textarea id="expense-review-note" rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" disabled={reviewExpense.isPending} onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button type="button" disabled={reviewExpense.isPending} onClick={handleSubmit}>
            {reviewExpense.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {action === "APPROVE" ? "Xác nhận duyệt" : "Xác nhận từ chối"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseReviewDialog;
