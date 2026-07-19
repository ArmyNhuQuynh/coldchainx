import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { TDispatchPackingResult } from "@/schemas/dispatch.schema";
import { AlertTriangle, X } from "lucide-react";
import { getPackingBlockingMessages } from "./dispatch-helpers";

type Props = {
  open: boolean;
  preview?: TDispatchPackingResult | null;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
};

const PackingPreviewDialog = ({
  open,
  preview,
  isLoading,
  onOpenChange,
}: Props) => {
  const canCreate =
    Boolean(preview?.canCreateTrip) && (preview?.unplacedLpnIds.length ?? 0) === 0;
  const blockingMessages = preview ? getPackingBlockingMessages(preview) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="h-[94dvh] w-[96vw] max-w-[96vw] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-[96vw]"
      >
        <DialogHeader className="border-b px-6 py-3 pr-14">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-4 top-3.5"
              title="Đóng mô phỏng"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle>Mô phỏng xếp hàng 3D</DialogTitle>
            {!isLoading && preview && (
              <Badge
                variant="outline"
                className={
                  canCreate
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }
              >
                {canCreate ? "Có thể tạo chuyến" : "Chưa thể tạo chuyến"}
              </Badge>
            )}
          </div>
          <DialogDescription>
            Kết quả do BE kiểm tra theo lịch, tập LPN, xe và khả năng xếp thực tế.
          </DialogDescription>
          {!isLoading && blockingMessages.length > 0 && (
            <div className="mt-1 flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="space-y-1">
                {blockingMessages.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            </div>
          )}
        </DialogHeader>

        <div className="min-h-0 bg-muted/20">
          {isLoading && <Skeleton className="h-full w-full rounded-none" />}
          {!isLoading && preview?.shareableLink && (
            <iframe
              key={preview.shareableLink}
              src={preview.shareableLink}
              title="Mô phỏng xếp hàng 3D"
              className="h-full w-full border-0"
            />
          )}
          {!isLoading && !preview?.shareableLink && (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
              BE chưa trả về đường dẫn mô phỏng 3D cho lựa chọn này.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackingPreviewDialog;
