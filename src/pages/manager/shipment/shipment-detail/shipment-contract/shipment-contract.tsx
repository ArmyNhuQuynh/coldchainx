import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useContract } from "@/hooks/use-contract";
import { handleApiError } from "@/lib/error";
import type { TOrder } from "@/schemas/order.schema";
import { QUOTATION_STATUS } from "@/types/enums/quotation-status.enum";
import { FileSignature, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ShipmentContractDialog from "./shipment-contract-dialog";
import ShipmentSendConfirmationDialog from "../components/shipment-send-confirmation-dialog";

type Props = {
  order: TOrder;
};

const ShipmentContract = ({ order }: Props) => {
  const {
    getContractByOrderId,
    previewContract,
    updateContractDraft,
    sendContract,
  } = useContract();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sendConfirmationOpen, setSendConfirmationOpen] = useState(false);

  const hasAcceptedQuotation = order.quotations.some(
    (quotation) => quotation.status === QUOTATION_STATUS.ACCEPTED
  );

  const {
    data: contractResponse,
    isLoading: isLoadingContract,
    isFetching: isFetchingContract,
    isError: isContractError,
  } = getContractByOrderId(order.orderId, open && hasAcceptedQuotation);
  const contract = contractResponse?.data;

  const {
    data: previewHtml,
    isLoading: isLoadingPreview,
    isFetching: isFetchingPreview,
    isError: isPreviewError,
  } = previewContract(order.orderId, open && !!contract);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setIsEditing(false);
      setSendConfirmationOpen(false);
    }
  };

  const handleUpdate = async (editedHtmlContent: string) => {
    if (!contract) return;

    try {
      const response = await updateContractDraft.mutateAsync({
        contractId: contract.contractId,
        data: { editedHtmlContent },
      });
      setIsEditing(false);
      toast.success(response.message || "Cập nhật hợp đồng thành công");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSend = async () => {
    if (!contract) return;

    try {
      const response = await sendContract.mutateAsync(contract.contractId);
      setSendConfirmationOpen(false);
      setIsEditing(false);
      toast.success(response.message || "Gửi hợp đồng thành công");
    } catch (error) {
      handleApiError(error);
    }
  };

  const isLoading = isLoadingContract || (!!contract && isLoadingPreview);
  const isError = isContractError || isPreviewError;

  return (
    <>
      <Button
        variant="outline"
        className="h-9 w-full justify-start gap-2 text-sm"
        disabled={!hasAcceptedQuotation}
        onClick={() => setOpen(true)}
      >
        <FileSignature className="h-4 w-4" />
        {hasAcceptedQuotation ? "Xem hợp đồng" : "Chưa có hợp đồng"}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] gap-3 overflow-y-auto p-3 sm:max-w-5xl sm:p-5">
          {isLoading ? (
            <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Đang tải hợp đồng...
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-sm text-destructive">
              Không thể tải hợp đồng của đơn hàng
            </div>
          ) : !contract ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Không tìm thấy hợp đồng của đơn hàng
            </div>
          ) : !previewHtml ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Hợp đồng chưa có nội dung xem trước
            </div>
          ) : (
            <ShipmentContractDialog
              contract={contract}
              html={previewHtml}
              isEditing={isEditing}
              isRefreshing={isFetchingContract || isFetchingPreview}
              isUpdating={updateContractDraft.isPending}
              isSending={sendContract.isPending}
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
        title="Gửi hợp đồng cho khách hàng?"
        description="Sau khi gửi, hợp đồng sẽ chuyển sang trạng thái chờ khách hàng ký và không thể chỉnh sửa."
        isPending={sendContract.isPending}
        onOpenChange={setSendConfirmationOpen}
        onConfirm={handleSend}
      />
    </>
  );
};

export default ShipmentContract;
