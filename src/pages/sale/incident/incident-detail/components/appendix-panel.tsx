import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useContractAppendix } from "@/hooks/use-contract-appendix";
import { handleApiError } from "@/lib/error";
import { resolveFileUrl } from "@/lib/file-url";
import { APPENDIX_STATUS, getAppendixStatusLabel } from "@/types/enums/appendix-status.enum";
import { ExternalLink, FileSignature, Loader2, PlayCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ShipmentSendConfirmationDialog from "@/pages/manager/shipment/shipment-detail/components/shipment-send-confirmation-dialog";
import AppendixEditorDialog from "./appendix-editor-dialog";

type Props = {
  orderId: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const AppendixPanel = ({ orderId }: Props) => {
  const {
    getAppendixByOrderId,
    getAppendixHtml,
    updateAppendixDraft,
    sendAppendix,
    executeAppendix,
  } = useContractAppendix();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sendConfirmationOpen, setSendConfirmationOpen] = useState(false);
  const [executeConfirmationOpen, setExecuteConfirmationOpen] = useState(false);
  const [shouldLoadAppendix, setShouldLoadAppendix] = useState(false);

  const {
    data: appendixResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = getAppendixByOrderId(orderId, shouldLoadAppendix);
  const appendix = appendixResponse?.data;
  const appendixId = appendix?.appendixId;

  const {
    data: appendixHtml,
    isLoading: isLoadingHtml,
    isFetching: isFetchingHtml,
  } = getAppendixHtml(appendixId, open && !!appendixId);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setIsEditing(false);
      setSendConfirmationOpen(false);
    }
  };

  const handleUpdate = async (editedHtmlContent: string) => {
    if (!appendix) return;

    try {
      const response = await updateAppendixDraft.mutateAsync({
        appendixId: appendix.appendixId,
        data: { editedHtmlContent },
      });
      setIsEditing(false);
      toast.success(response.message || "Cập nhật phụ lục thành công");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSend = async () => {
    if (!appendix) return;

    try {
      const response = await sendAppendix.mutateAsync(appendix.appendixId);
      setSendConfirmationOpen(false);
      setOpen(false);
      toast.success(response.message || "Gửi phụ lục thành công");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleExecute = async () => {
    if (!appendix) return;

    try {
      const response = await executeAppendix.mutateAsync(appendix.appendixId);
      setExecuteConfirmationOpen(false);
      toast.success(response.message || "Thực thi phụ lục thành công");
    } catch (error) {
      handleApiError(error);
    }
  };

  const status = appendix
    ? getAppendixStatusLabel(appendix.status)
    : getAppendixStatusLabel("");
  const html = appendixHtml || appendix?.draftHtmlContent || "";

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 p-4 pb-2">
          <div className="flex items-center gap-2 text-base font-semibold">
            <FileSignature className="h-5 w-5" />
            Phụ lục hợp đồng
          </div>
          {isFetching && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-2">
          {!shouldLoadAppendix ? (
            <div className="rounded-md border border-dashed p-4">
              <p className="text-sm text-muted-foreground">
                Kiểm tra phụ lục đã được tạo cho order này.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setShouldLoadAppendix(true)}
              >
                <FileSignature className="mr-2 h-4 w-4" />
                Kiểm tra phụ lục
              </Button>
            </div>
          ) : isLoading ? (
            <div className="text-sm text-muted-foreground">
              Đang tải phụ lục...
            </div>
          ) : isError || !appendix ? (
            <div className="rounded-md border border-dashed p-4">
              <p className="text-sm text-muted-foreground">
                Chưa tìm thấy phụ lục cho order này.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                disabled={isFetching}
                onClick={() => refetch()}
              >
                {isFetching && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Thử lại
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-primary">
                  {appendix.appendixNumber}
                </span>
                <Badge className={`${status.className} hover:opacity-90`}>
                  {status.label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-md border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    Phí điều chỉnh
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatCurrency(appendix.adjustedPrice)}
                  </p>
                </div>
                <div className="rounded-md border bg-background px-3 py-2">
                  <p className="text-xs text-muted-foreground">Trạng thái</p>
                  <p className="mt-1 text-sm font-semibold">{status.label}</p>
                </div>
              </div>

              <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                {appendix.reason ?? "—"}
              </p>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setOpen(true)}>
                  <FileSignature className="mr-2 h-4 w-4" />
                  Xem phụ lục
                </Button>
                {appendix.status === APPENDIX_STATUS.DRAFT && (
                  <Button onClick={() => setSendConfirmationOpen(true)}>
                    <Send className="mr-2 h-4 w-4" />
                    Gửi customer
                  </Button>
                )}
                {appendix.status === APPENDIX_STATUS.ACCEPTED && (
                  <Button onClick={() => setExecuteConfirmationOpen(true)}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Thực thi
                  </Button>
                )}
                {appendix.pdfUrl && (
                  <Button variant="ghost" asChild>
                    <a
                      href={resolveFileUrl(appendix.pdfUrl)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Mở PDF
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {appendix && (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] gap-3 overflow-y-auto p-3 sm:max-w-5xl sm:p-5">
            {isLoadingHtml && !html ? (
              <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang tải phụ lục...
              </div>
            ) : !html ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Phụ lục chưa có nội dung HTML
              </div>
            ) : (
              <AppendixEditorDialog
                appendix={appendix}
                html={html}
                isEditing={isEditing}
                isRefreshing={isFetching || isFetchingHtml}
                isUpdating={updateAppendixDraft.isPending}
                isSending={sendAppendix.isPending}
                onEdit={() => setIsEditing(true)}
                onCancelEdit={() => setIsEditing(false)}
                onUpdate={handleUpdate}
                onSend={() => setSendConfirmationOpen(true)}
              />
            )}
          </DialogContent>
        </Dialog>
      )}

      <ShipmentSendConfirmationDialog
        open={sendConfirmationOpen}
        title="Gửi phụ lục cho customer?"
        description="Sau khi gửi, phụ lục chuyển sang trạng thái SENT và chờ customer chấp nhận."
        isPending={sendAppendix.isPending}
        onOpenChange={setSendConfirmationOpen}
        onConfirm={handleSend}
      />

      <ShipmentSendConfirmationDialog
        open={executeConfirmationOpen}
        title="Thực thi phụ lục?"
        description="Hệ thống sẽ resolve discrepancy, tạo invoice phụ phí và đưa LPN về RECEIVING."
        confirmText="Thực thi"
        isPending={executeAppendix.isPending}
        onOpenChange={setExecuteConfirmationOpen}
        onConfirm={handleExecute}
      />
    </>
  );
};

export default AppendixPanel;
