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
import { CheckCircle, FilePenLine, XCircle } from "lucide-react";
import { toast } from "sonner";

type Props = {
  orderId: string;
  onApproved?: (quoteId: string) => void;
};

const OrderReviewActions = ({ orderId, onApproved }: Props) => {
  const { reviewOrder } = useOrder();
  const [openRequestUpdate, setOpenRequestUpdate] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [customerNote, setCustomerNote] = useState("");
  const [rejectNote, setRejectNote] = useState("");

  const handleApprove = () => {
    reviewOrder.mutate(
      { id: orderId, data: { action: "APPROVE", customerNote: null } },
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

  const handleRequestUpdate = () => {
    reviewOrder.mutate(
      {
        id: orderId,
        data: { action: "REQUEST_UPDATE", customerNote },
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Đã yêu cầu khách hàng cập nhật đơn!");
          setOpenRequestUpdate(false);
          setCustomerNote("");
        },
        onError: () => {
          toast.error("Yêu cầu cập nhật thất bại, thử lại sau!");
        },
      }
    );
  };

  const handleReject = () => {
    reviewOrder.mutate(
      {
        id: orderId,
        data: { action: "COMPLIANCE_REJECT", customerNote: rejectNote },
      },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Đã từ chối đơn hàng!");
          setOpenReject(false);
          setRejectNote("");
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
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={handleApprove}
          disabled={reviewOrder.isPending}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Duyệt đơn
        </Button>

        <Button
          variant="outline"
          onClick={() => setOpenRequestUpdate(true)}
          disabled={reviewOrder.isPending}
        >
          <FilePenLine className="h-4 w-4 mr-2" />
          Yêu cầu cập nhật
        </Button>

        <Button
          variant="destructive"
          onClick={() => setOpenReject(true)}
          disabled={reviewOrder.isPending}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Từ chối
        </Button>
      </div>

      <Dialog open={openRequestUpdate} onOpenChange={setOpenRequestUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yêu cầu khách hàng cập nhật</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <p className="text-sm text-muted-foreground">
              Nhập nội dung cần khách hàng bổ sung hoặc chỉnh sửa cho đơn hàng.
            </p>
            <Textarea
              placeholder="Ví dụ: Bổ sung hình ảnh hàng hóa, giấy tờ kiểm định..."
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenRequestUpdate(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleRequestUpdate}
              disabled={reviewOrder.isPending || !customerNote.trim()}
            >
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
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
              disabled={reviewOrder.isPending || !rejectNote.trim()}
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
