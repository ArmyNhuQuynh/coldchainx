import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIncident } from "@/hooks/use-incident";
import type { TIncident } from "@/schemas/incident.schema";
import { Loader2, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatIncidentMoney, getIncidentErrorMessage } from "@/components/incidents/incident-formatters";

type Props = {
  incident: TIncident | null;
  onOpenChange: (open: boolean) => void;
};

const ReimbursementDialog = ({ incident, onOpenChange }: Props) => {
  const { reimburseExpense } = useIncident();
  const [note, setNote] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  useEffect(() => {
    if (incident) {
      setNote("");
      setReceiptFile(null);
    }
  }, [incident]);

  const handleSubmit = async () => {
    if (!incident || incident.approvedAmount == null) return;
    if (!receiptFile) {
      toast.warning("Tải chứng từ chuyển tiền trước khi xác nhận.");
      return;
    }

    try {
      await reimburseExpense.mutateAsync({
        incidentId: incident.incidentId,
        data: {
          reimbursedAmount: incident.approvedAmount,
          note: note.trim() || undefined,
          receiptFile,
        },
      });
      toast.success("Đã ghi nhận hoàn tiền và gửi chứng từ cho tài xế.");
      onOpenChange(false);
    } catch (error: unknown) {
      toast.error(getIncidentErrorMessage(error, "Không thể ghi nhận hoàn tiền."));
    }
  };

  return (
    <Dialog open={Boolean(incident)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Xác nhận hoàn tiền</DialogTitle>
          <DialogDescription>
            Số tiền phải hoàn đúng bằng khoản đã duyệt: {formatIncidentMoney(incident?.approvedAmount)}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Người nhận</p>
            <p className="mt-1 font-semibold">{incident?.reportedByUsername || "—"}</p>
            <p className="mt-3 text-sm text-muted-foreground">Số tiền giải ngân</p>
            <p className="mt-1 text-xl font-semibold">{formatIncidentMoney(incident?.approvedAmount)}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reimbursement-receipt">Chứng từ chuyển tiền</Label>
            <Input id="reimbursement-receipt" type="file" accept="image/*,.pdf" onChange={(event) => setReceiptFile(event.target.files?.[0] ?? null)} />
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><ReceiptText className="h-3.5 w-3.5" /> Chứng từ này sẽ được lưu và gửi cho tài xế xem.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reimbursement-note">Nội dung chuyển tiền</Label>
            <Textarea id="reimbursement-note" rows={3} value={note} placeholder="Hoàn chi phí xử lý sự cố..." onChange={(event) => setNote(event.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" disabled={reimburseExpense.isPending} onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button type="button" disabled={reimburseExpense.isPending || !receiptFile} onClick={handleSubmit}>
            {reimburseExpense.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Xác nhận đã hoàn tiền
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReimbursementDialog;
