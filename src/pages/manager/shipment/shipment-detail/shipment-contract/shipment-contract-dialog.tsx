import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resolveFileUrl } from "@/lib/file-url";
import type { TContractInfo } from "@/schemas/contract.schema";
import {
  CONTRACT_STATUS,
  getContractStatusLabel,
} from "@/types/enums/contract-status.enum";
import { ExternalLink, Loader2, Pencil, Save, Send } from "lucide-react";

type Props = {
  contract: TContractInfo;
  html: string;
  isEditing: boolean;
  isRefreshing: boolean;
  isUpdating: boolean;
  isSending: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (html: string) => Promise<void>;
  onSend: () => void;
  isVerifying: boolean;
  onVerify: () => void;
};

const getReadOnlyMessage = (status: TContractInfo["status"]) => {
  switch (status) {
    case CONTRACT_STATUS.PENDING_CUSTOMER_SIGNATURE:
      return "Hợp đồng đã được gửi và đang chờ khách hàng ký.";
    case CONTRACT_STATUS.PENDING_SALES_VERIFICATION:
      return "Khách hàng đã tải bản ký, đang chờ Sale xác minh.";
    case CONTRACT_STATUS.ACTIVE:
      return "Hợp đồng đã có hiệu lực.";
    default:
      return "Hợp đồng hiện không thể chỉnh sửa.";
  }
};

const ShipmentContractDialog = ({
  contract,
  html,
  isEditing,
  isRefreshing,
  isUpdating,
  isSending,
  onEdit,
  onCancelEdit,
  onUpdate,
  onSend,
  isVerifying,
  onVerify,
}: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { label, className } = getContractStatusLabel(contract.status);
  const canModify =
    contract.status === CONTRACT_STATUS.DRAFT ||
    contract.status === CONTRACT_STATUS.PENDING_SIGNATURE;

  const handleFrameLoad = () => {
    const document = iframeRef.current?.contentDocument;
    if (!document?.body) return;

    document.designMode = isEditing ? "on" : "off";
    document.body.contentEditable = isEditing ? "true" : "false";
    document.body.spellcheck = isEditing;
  };

  const handleSave = async () => {
    const document = iframeRef.current?.contentDocument;
    if (!document?.documentElement) return;

    const doctype = document.doctype
      ? `<!DOCTYPE ${document.doctype.name}>\n`
      : "";
    await onUpdate(`${doctype}${document.documentElement.outerHTML}`);
  };

  return (
    <>
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2 pr-8">
          <DialogTitle>Hợp đồng vận chuyển</DialogTitle>
          <Badge className={className}>{label}</Badge>
          {isRefreshing && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <DialogDescription>
          Số hợp đồng: {contract.contractNumber}
          {isEditing && " · Nhấp trực tiếp vào nội dung bên dưới để chỉnh sửa"}
        </DialogDescription>
      </DialogHeader>

      <div className="overflow-hidden rounded-md border bg-white">
        <iframe
          key={isEditing ? "contract-editor" : "contract-preview"}
          ref={iframeRef}
          title={`Hợp đồng ${contract.contractNumber}`}
          srcDoc={html}
          sandbox="allow-same-origin"
          onLoad={handleFrameLoad}
          className="h-[58vh] min-h-[360px] w-full bg-white"
        />
      </div>

      <DialogFooter className="items-center sm:justify-between">
        <div>
          {contract.fileUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a
                href={resolveFileUrl(contract.fileUrl)}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Mở file hợp đồng
              </a>
            </Button>
          )}
        </div>

        {canModify ? (
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={onCancelEdit}
                  disabled={isUpdating}
                >
                  Hủy
                </Button>
                <Button onClick={handleSave} disabled={isUpdating}>
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Lưu thay đổi
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onEdit}
                  disabled={isSending}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
                <Button onClick={onSend} disabled={isSending}>
                  {isSending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Gửi hợp đồng
                </Button>
              </>
            )}
          </div>
        ) : contract.status === CONTRACT_STATUS.PENDING_SALES_VERIFICATION ? (
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button onClick={onVerify} disabled={isVerifying}>
              {isVerifying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Xác nhận hợp đồng đã ký
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {getReadOnlyMessage(contract.status)}
          </p>
        )}
      </DialogFooter>
    </>
  );
};

export default ShipmentContractDialog;
