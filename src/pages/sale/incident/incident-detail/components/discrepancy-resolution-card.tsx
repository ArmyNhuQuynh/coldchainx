import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { CheckCircle2, Loader2, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";

type RejectPayload = {
  penaltyAmount: number;
  penaltyReason: string;
};

type Props = {
  isPending: boolean;
  onApprove: () => Promise<void>;
  onReject: (payload: RejectPayload) => Promise<void>;
};

const DiscrepancyResolutionCard = ({
  isPending,
  onApprove,
  onReject,
}: Props) => {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [penaltyAmount, setPenaltyAmount] = useState("200000");
  const [penaltyReason, setPenaltyReason] = useState(
    "Customer rejected surcharge"
  );

  const handleReject = async () => {
    await onReject({
      penaltyAmount: Number(penaltyAmount) || 0,
      penaltyReason,
    });
    setRejectOpen(false);
  };

  const handleApprove = async () => {
    await onApprove();
    setApproveOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 p-4 pb-2 text-base font-semibold">
          <RotateCcw className="h-5 w-5" />
          Resolve nhanh
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Dùng khi Sale muốn xử lý trực tiếp không chờ phụ lục.
          </p>
          <div className="grid grid-cols-1 gap-2">
            <Button
              className="justify-start"
              disabled={isPending}
              onClick={() => setApproveOpen(true)}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              className="justify-start border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
              disabled={isPending}
              onClick={() => setRejectOpen(true)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] p-4 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Approve sai lệch?</DialogTitle>
            <DialogDescription>
              LPN sẽ chuyển về RECEIVING để warehouse tiếp tục putaway.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setApproveOpen(false)}
            >
              Hủy
            </Button>
            <Button disabled={isPending} onClick={handleApprove}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="w-[calc(100vw-1.5rem)] p-4 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject sai lệch</DialogTitle>
            <DialogDescription>
              LPN sẽ chuyển sang RETURN_PENDING và hệ thống tạo penalty bill.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="penaltyAmount">Phí phạt</Label>
              <Input
                id="penaltyAmount"
                inputMode="numeric"
                value={penaltyAmount}
                onChange={(event) => setPenaltyAmount(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="penaltyReason">Lý do</Label>
              <Textarea
                id="penaltyReason"
                value={penaltyReason}
                onChange={(event) => setPenaltyReason(event.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => setRejectOpen(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-rose-600 text-white hover:bg-rose-700"
              disabled={isPending}
              onClick={handleReject}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DiscrepancyResolutionCard;
