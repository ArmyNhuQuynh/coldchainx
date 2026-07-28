import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  note: string;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onNoteChange: (note: string) => void;
  onConfirm: () => void;
};

const ShipmentContractResubmitDialog = ({
  open,
  note,
  isPending,
  onOpenChange,
  onNoteChange,
  onConfirm,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Yêu cầu khách hàng gửi lại hợp đồng</DialogTitle>
          <DialogDescription>
            Ghi rõ nội dung sai sót để khách hàng sửa và tải lên bản hợp đồng mới.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Ví dụ: Chữ ký chưa đầy đủ hoặc file bị thiếu trang..."
          rows={5}
          disabled={isPending}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending || !note.trim()}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Gửi yêu cầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentContractResubmitDialog;
