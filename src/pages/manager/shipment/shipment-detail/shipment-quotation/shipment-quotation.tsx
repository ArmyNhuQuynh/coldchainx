import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuotation } from "@/hooks/use-quotation";
import { handleApiError } from "@/lib/error";
import type { TOrder } from "@/schemas/order.schema";
import type { TQuotation, TUpdateQuotation } from "@/schemas/quotation.schema";
import { QUOTATION_STATUS } from "@/types/enums/quotation-status.enum";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ShipmentQuotationDialog from "./shipment-quotation-dialog";
import ShipmentSendConfirmationDialog from "../components/shipment-send-confirmation-dialog";

type Props = {
  order: TOrder;
  preferredQuoteId?: string;
};

const selectActiveQuotation = (
  quotations: TQuotation[],
  preferredQuoteId?: string
) => {
  return (
    quotations.find((quotation) => quotation.quoteId === preferredQuoteId) ??
    quotations.find((quotation) => quotation.status === QUOTATION_STATUS.ACCEPTED) ??
    quotations.find((quotation) => quotation.status === QUOTATION_STATUS.SENT) ??
    quotations.find((quotation) => quotation.status === QUOTATION_STATUS.DRAFT) ??
    quotations[0]
  );
};

const OrderQuotation = ({ order, preferredQuoteId }: Props) => {
  const { getQuotationsByOrder, updateQuotation, sendQuotation } = useQuotation();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sendConfirmationOpen, setSendConfirmationOpen] = useState(false);

  const { data, isLoading, isFetching, isError } = getQuotationsByOrder(
    order.orderId,
    { pageNumber: 1, pageSize: 100 },
    open
  );

  const quotations = data?.data.data ?? [];
  const activeQuotation = useMemo(
    () => selectActiveQuotation(quotations, preferredQuoteId),
    [preferredQuoteId, quotations]
  );
  const embeddedQuotations = order.quotations ?? [];
  const hasQuotation = !!preferredQuoteId || embeddedQuotations.length > 0;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setIsEditing(false);
      setSendConfirmationOpen(false);
    }
  };

  const handleUpdate = async (values: TUpdateQuotation) => {
    if (!activeQuotation) return;

    try {
      await updateQuotation.mutateAsync({
        quoteId: activeQuotation.quoteId,
        data: values,
      });
      setIsEditing(false);
      toast.success("Cập nhật báo giá thành công");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSend = async () => {
    if (!activeQuotation) return;

    try {
      const response = await sendQuotation.mutateAsync(activeQuotation.quoteId);
      setSendConfirmationOpen(false);
      toast.success(response.message || "Gửi báo giá thành công");
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="h-9 w-full justify-start gap-2 text-sm"
        onClick={() => setOpen(true)}
      >
        <FileText className="h-4 w-4" />
        {hasQuotation ? "Xem bảng báo giá chi tiết" : "Kiểm tra báo giá"}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[84vh] w-[calc(100vw-1.5rem)] overflow-y-auto p-4 sm:max-w-2xl sm:p-5">
          {isLoading && !activeQuotation ? (
            <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang tải báo giá...
            </div>
          ) : isError ? (
            <div className="py-10 text-center text-sm text-destructive">
              Không thể tải thông tin báo giá
            </div>
          ) : !activeQuotation ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Không tìm thấy báo giá của đơn hàng
            </div>
          ) : (
            <ShipmentQuotationDialog
              quotation={activeQuotation}
              isEditing={isEditing}
              isRefreshing={isFetching}
              isUpdating={updateQuotation.isPending}
              isSending={sendQuotation.isPending}
              onEdit={() => setIsEditing(true)}
              onCancelEdit={() => setIsEditing(false)}
              onUpdate={handleUpdate}
              onSend={() => setSendConfirmationOpen(true)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ShipmentSendConfirmationDialog
        open={sendConfirmationOpen}
        title="Gửi báo giá cho khách hàng?"
        description="Sau khi gửi, báo giá sẽ chuyển sang trạng thái SENT và không thể chỉnh sửa."
        isPending={sendQuotation.isPending}
        onOpenChange={setSendConfirmationOpen}
        onConfirm={handleSend}
      />
    </>
  );
};

export default OrderQuotation;
