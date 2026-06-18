import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useOrder } from "@/hooks/use-order";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

type Props = {
  orderId: string;
  onApproved?: (quoteId: string) => void;
};

const OrderReviewActions = ({ orderId, onApproved }: Props) => {
  const { reviewOrder } = useOrder();
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = () => {
    reviewOrder.mutate(
      { id: orderId, data: { action: "APPROVE", rejectReason: null } },
      {
        onSuccess: (response) => {
          if (response.data.quoteId) {
            onApproved?.(response.data.quoteId);
          }
          toast.success(response.message || "Đã duyệt đơn hàng thành công!");
        },
        onError: () => {
          toast.error("Duyệt đơn hàng thất bại, thử lại sau!");
        },
      }
    );
  };

  const handleReject = () => {
    reviewOrder.mutate(
      { id: orderId, data: { action: "REJECT", rejectReason } },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Đã từ chối đơn hàng!");
          setOpenReject(false);
          setRejectReason("");
        },
        onError: () => {
          toast.error("Từ chối đơn hàng thất bại, thử lại sau!");
        },
      }
    );
  };

  return (
    <>
      <div className="flex gap-3">
        {/* Nút Duyệt */}
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={handleApprove}
          disabled={reviewOrder.isPending}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Duyệt đơn
        </Button>

        {/* Nút Từ chối */}
        <Button
          variant="destructive"
          onClick={() => setOpenReject(true)}
          disabled={reviewOrder.isPending}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Từ chối
        </Button>
      </div>

      {/* Dialog từ chối */}
      <Dialog open={openReject} onOpenChange={setOpenReject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <p className="text-sm text-muted-foreground">
              Vui lòng nhập lý do từ chối để khách hàng được biết.
            </p>
            <Textarea
              placeholder="Nhập lý do từ chối..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenReject(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={reviewOrder.isPending || !rejectReason.trim()}
            >
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderReviewActions;
